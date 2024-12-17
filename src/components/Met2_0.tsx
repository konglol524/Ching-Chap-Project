"use client";
import React, { useEffect, useRef, useState } from 'react';

export const Metronome: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const intervalRef = useRef<number>(0);
  const secondsPerBeatRef = useRef<number>(60.0 / bpm);
  const lastBpmChangeTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for debounce timeout
  const lastBpmRef = useRef<number>(bpm);

  const playMetronomeSound = (time: number) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(1000, time); // Frequency for the beep sound
    oscillator.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + 0.1); // Play for 100ms
  };

  const scheduleNotes = () => {
    const currentTime = audioContextRef.current?.currentTime || 0;

    // Schedule notes to be played
    while (nextNoteTimeRef.current < currentTime + 0.1) {
      playMetronomeSound(nextNoteTimeRef.current);
      nextNoteTimeRef.current += secondsPerBeatRef.current; // Increment based on current BPM
    }

    // Request the next animation frame to keep scheduling
    intervalRef.current = requestAnimationFrame(scheduleNotes);
  };

  const startMetronome = () => {
    if (!isPlayingRef.current) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      isPlayingRef.current = true;
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduleNotes();
    }
  };

  const stopMetronome = () => {
    isPlayingRef.current = false;
    cancelAnimationFrame(intervalRef.current);
  };

  const handleBpmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = Number(event.target.value);
    const currentTime = audioContextRef.current?.currentTime || 0;
    setBpm(newBpm);
    // Clear the previous timeout if it exists

    const newSecondsPerBeat = 60.0 / newBpm;
    secondsPerBeatRef.current = newSecondsPerBeat;    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to update the BPM after a delay
      // Check if enough time has passed since the last BPM change
    let timeElapsed = currentTime - lastBpmChangeTimeRef.current;
    if (timeElapsed >= 100 / 1000) { // 100ms delay 
      // Calculate the rate of change
      timeElapsed = Math.max(timeElapsed, 0.01);
      const bpmDifference = newBpm - lastBpmRef.current;
      const rateOfChange = bpmDifference / timeElapsed; // BPM change per second
      console.log(rateOfChange)
      if (audioContextRef.current) {
        // Check if the rate of change exceeds the threshold (e.g., 10 BPM per second)
        if (rateOfChange > 10 && lastBpmRef.current < 40) {
          // Directly set nextNoteTimeRef for immediate change
          console.log('condition 1')
          nextNoteTimeRef.current = currentTime + newSecondsPerBeat;
        } else {
          // Adjust nextNoteTime to maintain the current rhythm
          console.log('condition 2')
          const timeDifference = nextNoteTimeRef.current - currentTime;
          nextNoteTimeRef.current = currentTime + timeDifference * (secondsPerBeatRef.current / newSecondsPerBeat);
        }
      }
      // Update the last BPM change time
      lastBpmChangeTimeRef.current = currentTime;
      lastBpmRef.current = newBpm;
    }
  };

  useEffect(() => {
    return () => {
      stopMetronome();
      // Clear the timeout on unmount to avoid memory leaks
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h1>Metronome</h1>
      <div>
        <input
          type="range"
          min={1}
          max={300}
          value={bpm}
          onChange={handleBpmChange}
          className="slider w-300"
        />
        <span>{bpm} BPM</span>
      </div>
      <button onClick={startMetronome}>Start</button>
      <button onClick={stopMetronome}>Stop</button>
    </div>
  );
};