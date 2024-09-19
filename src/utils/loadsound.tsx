import { useRef } from "react";

export const loadSound = async (url: string, audioContext: AudioContext | null): Promise<AudioBuffer | null> => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContext?.decodeAudioData(arrayBuffer) ?? null;
    } catch (error) {
      console.error("Error loading sound:", error);
      return null;
    }
  };