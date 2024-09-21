"use client";
import { useContext } from "react";
import { AudioContext } from "./AudioContextProvider";
import { Volume2, VolumeOff } from "lucide-react";

export const VolumeControl = () => {
  const audioCtx = useContext(AudioContext);

  if (!audioCtx) return null;

  return (
    <div className="flex items-center space-x-1">
    <label htmlFor="volume">
        {audioCtx.volume > 0 ? <Volume2 size={30} /> : <VolumeOff size={30} />}
      </label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={audioCtx.volume}
        onChange={(e) => audioCtx.setVolume(parseFloat(e.target.value))}
        className="w-20rem"
      />
    </div>
  );
};