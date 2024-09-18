"use client";
import { Link, Music, Square } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export default function Home() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const chingBufferRef = useRef<AudioBuffer | null>(null);
  const chapBufferRef = useRef<AudioBuffer | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null); // Ref to keep track of the current playing source
  const gainNodeRef = useRef<GainNode | null>(null);
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null); // State to manage wake lock

  const [tap1, setTap1] = useState<number | null>(null);
  const [tap2, setTap2] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChap, setIsChap] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [length, setLength] = useState<number | null>(0);
  const [volume, setVolume] = useState(0.7);

  // Load audio files into AudioBuffer
  const loadSound = async (url: string): Promise<AudioBuffer | null> => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioContextRef.current?.decodeAudioData(arrayBuffer) ?? null;
    } catch (error) {
      console.error("Error loading sound:", error);
      return null; // Return null if there's an error
    }
  };

  // Initialize the audio context and buffers
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Load ching and chap sounds
    loadSound("/ChingSample.mp3").then((buffer) => {
      chingBufferRef.current = buffer;
    });
    loadSound("/ChapSample.mp3").then((buffer) => {
      chapBufferRef.current = buffer;
    });
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = volume; // Set initial volume
    // Clean up wake lock on component unmount
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []);

  useEffect(()=>{
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.value = volume; // Update GainNode's gain value
    }
  }, [volume])

  // Play sound using Web Audio API
  const playSound = (buffer: AudioBuffer | null) => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop(); // Stop the current playing sound
    }    
    if (!audioContextRef.current || !buffer || !gainNodeRef.current) return;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);
    // connection: Source -> GainNode -> Destination
    source.start(0);
    currentSourceRef.current = source;
    // Request wake lock when audio starts playing
    requestWakeLock();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume); // Update volume state
  };
  
  const play = useCallback(() => {
    if (isChap) {
        playSound(chapBufferRef.current); // Play Chap sound
        if (stopRequested) {
          stop();
        } 
    } else {
      if (stopRequested) {
        stop();
      } else {
        playSound(chingBufferRef.current); // Play Ching sound
      }
    }
    setIsChap((prev) => !prev);
  }, [isChap]);

  const handleTap = () => {
    if (!isPlaying) {
      if (tap1 === null) {
        setTap1(Date.now());
        playSound(chingBufferRef.current); // First tap plays ching
        setIsChap(true);  // Next sound will be chap
      } else {
        setTap2(Date.now());
        playSound(chapBufferRef.current); // Second tap plays chap
        setIsChap(false);  // Next sound will be ching
      }
    }
  };

  const startChingChap = useCallback((interval: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(play, interval);
  }, [play]);

  useEffect(() => {
    if (tap1 !== null && tap2 !== null) {
      const newInterval = tap2 - tap1;
      setLength(newInterval);
      console.log(newInterval);
      startChingChap(newInterval);
      setIsPlaying(true);
    }
  }, [tap2, startChingChap]);

  const handleStop = () => {
    if (isPlaying) {
      setStopRequested((prev)=>(true));
      console.log("Stop requested, will stop after next CHAP");
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setTap1(null);
    setTap2(null);
    setIsChap(false);
    setStopRequested(false);
    if (wakeLock) {
      wakeLock.release();
    }
  };

    // Request wake lock
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          const wakeLockSentinel = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLockSentinel);
  
          // Listen for when the wake lock is released
          wakeLockSentinel.addEventListener('release', () => {
            console.log('Wake lock released');
          });
  
          console.log('Wake lock active');
        } else {
          console.warn('Wake Lock API not supported on this browser.');
        }
      } catch (err) {
        reportError({ message: getErrorMessage(err) })
      }
    };

    function getErrorMessage(error: unknown) {
      if (error instanceof Error) return error.message
      return String(error)
    }
  
    // Release wake lock when metronome stops
    const releaseWakeLock = () => {
      if (wakeLock) {
        wakeLock.release();
        setWakeLock(null);
      }
    };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-5 text-white">
      <h1 className="text-2xl font-bold mb-8 mx-auto sm:text-4xl">Ching-Chap Metronome</h1>
      <p className="text-2xl font-semibold mb-4">
        {isPlaying ? "Press stop to end" : "Press twice to begin"}
      </p>

      <div className="flex flex-col items-center space-y-8">
        <button
          className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            isPlaying ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          } `}
          onClick={handleTap}
        >
          {

          }
          <Music size={48} />
        </button>

        <button
          className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          onClick={handleStop}
        >
          <Square size={36} />
        </button>

        <div className="text-center">
          <p className="text-2xl font-semibold">Current Tempo</p>
          <p className="text-4xl font-bold">
            {length ? `${(length / 1000).toFixed(2)} second` : "--"}
          </p>
          <p className="text-xl">{length ? `${Math.round(60000 / length)} BPM` : "--"}</p>
        </div>
      </div>
      <label htmlFor="volume" className="block text-xl mb-2 ">Volume</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className=" w-20rem"
          />

      <footer className="mt-8">
    <a
      href="https://github.com/konglol524"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-white underline hover:text-gray-300"
    >
      Made by Kong
    </a>
                 
  </footer>
    </main>
  );
}
