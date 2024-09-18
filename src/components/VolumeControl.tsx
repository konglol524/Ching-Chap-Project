"use client";
import { useContext } from "react";
import { AudioContext } from "./AudioContextProvider";

export const VolumeControl = () => {
  const audioCtx = useContext(AudioContext);

  if (!audioCtx) return null;

  return (
    <div className="flex-col items-center justify-center ">
      <label htmlFor="volume" className="block text-xl ml-6">Volume</label>
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