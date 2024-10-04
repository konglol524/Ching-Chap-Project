"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { AudioContext } from "./AudioContextProvider";
import { Volume2, VolumeOff, ChevronDown } from "lucide-react";

export const VolumeControl = () => {
  const audioCtx = useContext(AudioContext);
  const [previousVolume, setPreviousVolume] = useState<number>(audioCtx?.volume || 0.75); // Save previous volume for mute/unmute functionality
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Close the slider when clicking outside (ignores volume icon clicks)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        sliderRef.current &&
        sliderRef.current.contains(event.target as Node) && 
        !(event.target as HTMLElement).closest("#slider-input")
      ) {
        setIsSliderVisible(false);
      }
    };

    // Attach event listener only when slider is visible
    if (isSliderVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Clean up event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSliderVisible]);

  if (!audioCtx) return null;

  // Toggle mute/unmute
  const toggleMute = () => {
    if (audioCtx.volume > 0) {
      // Mute the audio and save the current volume
      setPreviousVolume(audioCtx.volume);
      audioCtx.setVolume(0);
    } else {
      // Unmute and restore the previous volume
      audioCtx.setVolume(previousVolume || 0.75); // Default to 0.75 if no previous volume is set
    }
  };

  // Toggle slider visibility
  const toggleSliderVisibility = () => {
    setIsSliderVisible((prev) => !prev);
  };



  return (
    <div className="relative flex items-center space-x-2 mt-4">
      {/* Volume Icon (Mute/Unmute) */}
      <button
        onClick={toggleMute}
        className="flex items-center justify-center p-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
        aria-label={audioCtx.volume > 0 ? "Mute audio" : "Unmute audio"}
      >
        {audioCtx.volume > 0 ? (
          <Volume2 size={36} />
        ) : (
          <VolumeOff size={36} />
        )}
      </button>

      {/* Volume Slider - Now between the main volume icon and slider toggle button */}
      {isSliderVisible && (
        <div
          ref={sliderRef}
          className="flex items-center p-2 bg-gray-800 bg-opacity-90 rounded-md shadow-lg transition-all duration-300 z-30"
        >
          <input
            id="slider-input"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioCtx.volume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newVolume = parseFloat(e.target.value);
              audioCtx.setVolume(newVolume);
              if (newVolume > 0) {
                setPreviousVolume(newVolume);
              }
            }}
            className="w-48 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none"
            aria-label="Volume slider"
          />
        </div>
      )}

      {/* Slider Toggle Button */}
      <button
        id="slider-toggle"
        onClick={toggleSliderVisibility}
        className="flex items-center justify-center p-2 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
        aria-label="Toggle volume slider"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
};
