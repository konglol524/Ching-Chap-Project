"use client";
import { createContext, useRef, useEffect, useState, ReactNode } from "react";
import { loadSound } from "@/utils/loadsound";

type AudioContextType = {
  chingBuffer: AudioBuffer | null;
  chapBuffer: AudioBuffer | null;
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  volume: number;
  setVolume: (volume: number) => void;
  setChingBuffer: (value: AudioBuffer | null) => void;
  setChapBuffer: (value: AudioBuffer | null) => void;
}; 

export const AudioContext = createContext<AudioContextType | null>(null);

export const initAudioContext = (audioCtx: AudioContextType)=>{
  if(!audioCtx.audioContext){
    audioCtx.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtx.gainNode = audioCtx.audioContext.createGain();
    audioCtx.gainNode.gain.value = audioCtx.volume;
    loadSound("/Chingduriya.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
    loadSound("/Chapduriya.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
  }
}



export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [chingBuffer, setChingBuffer] = useState<AudioBuffer | null>(null);
  const [chapBuffer, setChapBuffer] = useState<AudioBuffer | null>(null);
  const [volume, setVolume] = useState(0.7);
  
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume;
    loadSound("/Chingduriya.mp3", audioContextRef.current).then(setChingBuffer);
    loadSound("/Chapduriya.mp3", audioContextRef.current).then(setChapBuffer);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  return (
    <AudioContext.Provider
      value={{
        chingBuffer,
        chapBuffer,
        audioContext: audioContextRef.current,
        gainNode: gainNodeRef.current,
        volume,
        setVolume,
        setChingBuffer,
        setChapBuffer
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};