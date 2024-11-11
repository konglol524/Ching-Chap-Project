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
  loadCustomSound: (url: string, isChing: boolean) => Promise<void>;
  closeAudio: () => void;
};

export const AudioContext = createContext<AudioContextType | null>(null);

export const initAudioContext = async (audioCtx: AudioContextType) => {
  if (!audioCtx.audioContext) {
    audioCtx.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtx.gainNode = audioCtx.audioContext.createGain();
    audioCtx.gainNode.gain.value = audioCtx.volume;
    
    try {
      const [ching, chap] = await Promise.all([
        loadSound("/Chingduriya.mp3", audioCtx.audioContext),
        loadSound("/Chapduriya.mp3", audioCtx.audioContext)
      ]);
      audioCtx.setChingBuffer(ching);
      audioCtx.setChapBuffer(chap);
    } catch (error) {
      console.error("Error loading default sounds:", error);
    }
  }
};

export const AudioContextProvider = ({ children }: { children: ReactNode }) => {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [chingBuffer, setChingBuffer] = useState<AudioBuffer | null>(null);
  const [chapBuffer, setChapBuffer] = useState<AudioBuffer | null>(null);
  const [volume, setVolume] = useState(0.7);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Initialize audio context and load default sounds
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume;

    const loadDefaultSounds = async () => {
      try {
        const [ching, chap] = await Promise.all([
          loadSound("/Chingduriya.mp3", audioContextRef.current!),
          loadSound("/Chapduriya.mp3", audioContextRef.current!)
        ]);
        setChingBuffer(ching);
        setChapBuffer(chap);
      } catch (error) {
        console.error("Error loading default sounds:", error);
      }
    };

    loadDefaultSounds();

    // Cleanup function
    return () => {
      // Stop all active sources
      activeSourcesRef.current.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // Ignore errors from already stopped sources
        }
      });
      activeSourcesRef.current.clear();

      // Close audio context
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }

      // Release wake lock
      wakeLock?.release();
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Function to load custom sounds
  const loadCustomSound = async (url: string, isChing: boolean) => {
    if (!audioContextRef.current) return;

    try {
      const buffer = await loadSound(url, audioContextRef.current);
      if (isChing) {
        setChingBuffer(buffer);
      } else {
        setChapBuffer(buffer);
      }
    } catch (error) {
      console.error(`Error loading ${isChing ? 'ching' : 'chap'} sound:`, error);
    }
  };

  // Function to close audio context and clean up
  const closeAudio = () => {
    // Stop all active sources
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Ignore errors from already stopped sources
      }
    });
    activeSourcesRef.current.clear();

    // Close audio context
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
  };

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
        setChapBuffer,
        loadCustomSound,
        closeAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};