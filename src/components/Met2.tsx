"use client";
import React, { useEffect, useRef, useState } from 'react';

export const Metronome: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // Direction state for ping-pong
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const intervalRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const secondsPerBeatRef = useRef<number>(60.0 / bpm);
  const lastBeatTimeRef = useRef<number>(0);

  const playMetronomeSound = (time: number) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(1000, time);
    oscillator.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.1);
  };

  const updateVisualizer = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const currentTime = audioContext.currentTime;
    const timeSinceLastBeat = currentTime - lastBeatTimeRef.current;
    const beatDuration = secondsPerBeatRef.current;

    // Calculate the amount to move per beat cycle (ping-pong effect)
    const maxPosition = 100; // Max position in percentage
    const progress = (timeSinceLastBeat / beatDuration) * maxPosition;

    // Update position based on current direction and progress
    const newPosition = position + progress * direction;

    // If position reaches boundaries, reverse the direction
    if (newPosition >= maxPosition || newPosition <= 0) {
      setDirection((prev) => -prev);
      lastBeatTimeRef.current = currentTime;
    } else {
      setPosition(newPosition);
    }

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  useEffect(() => {
    if (isPlaying && audioContextRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]); // Depend on isPlaying state

  const scheduleNotes = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;
    
    const currentTime = audioContext.currentTime;

    while (nextNoteTimeRef.current < currentTime + 0.1) {
      playMetronomeSound(nextNoteTimeRef.current);
      lastBeatTimeRef.current = nextNoteTimeRef.current;
      nextNoteTimeRef.current += secondsPerBeatRef.current;
    }

    intervalRef.current = requestAnimationFrame(scheduleNotes);
  };

  const startMetronome = () => {
    if (!isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      nextNoteTimeRef.current = audioContext.currentTime;
      lastBeatTimeRef.current = audioContext.currentTime;
      
      setPosition(0);
      setDirection(1); // Start with left-to-right
      setIsPlaying(true);
      scheduleNotes();
    }
  };

  const stopMetronome = () => {
    setIsPlaying(false);
    cancelAnimationFrame(intervalRef.current);
    setPosition(0);
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
    secondsPerBeatRef.current = 60.0 / newBpm;
  };

  useEffect(() => {
    return () => {
      stopMetronome();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Metronome</h1>
      <div className="mb-4">
        <input
          type="range"
          min={1}
          max={300}
          value={bpm}
          onChange={handleBpmChange}
          className="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="ml-4">{bpm} BPM</span>
      </div>
      <div className="space-x-4 mb-6">
        <button
          onClick={startMetronome}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start
        </button>
        <button
          onClick={stopMetronome}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Stop
        </button>
      </div>

      {/* Visualizer */}
      <div className="relative w-full h-12 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
        <div
          style={{
            position: 'absolute',
            left: `${position}%`,
            transform: 'translateX(-50%)',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#FCD34D',
            top: '50%',
            marginTop: '-10px',
          }}
        />
      </div>
    </div>
  );
};
