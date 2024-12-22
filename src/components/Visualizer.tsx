import React, { FC, useEffect, useState } from "react";

interface VisualizerProps {
  isPlaying: boolean;
  length: number | null; // Interval in milliseconds
  isChap: boolean; // Toggles between Ching and Chap beats
}

export const Visualizer: FC<VisualizerProps> = ({ isPlaying, length, isChap }) => {
  const [position, setPosition] = useState<"left" | "right">("left"); // Track current position

  // Update position every time isChap changes
  useEffect(() => {
    if (isPlaying && length) {
      setPosition((prev) => (prev === "left" ? "right" : "left"));
    } else {
      setPosition("left"); // Reset position when stopped
    }
  }, [isChap, isPlaying]);

  return (
    <div className="flex flex-col items-center mt-5 space-y-4">
      {/* Bar Container */}
      <div className="relative w-full max-w-6xl h-4 bg-gray-300 rounded-full overflow-hidden">
        {/* Subdivision Lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="absolute h-full w-[2px] bg-gray-500"
            style={{ left: `${i * 25}%` }}
          />
        ))}

        {/* Moving Ball */}
        <div
          className={`absolute top-[-6px] w-6 h-6 rounded-full shadow-lg transition-transform ${
            isChap ? "bg-orange-500 shadow-orange-500" : "bg-blue-400 shadow-blue-400"
          }`}
          style={{
            left: position === "left" ? "0%" : "100%",
            transform: "translate(-50%, 0)",
            transition: isPlaying
              ? `left ${length ? length  : 0}ms linear`
              : "none", 
          }}
        ></div>
      </div>

      {/* Beat Indicator */}
      <div className="text-gray-600 text-sm w-24 text-center">
        {isChap ? "Chap Beat" : "Ching Beat"}
      </div>
    </div>
  );
};
