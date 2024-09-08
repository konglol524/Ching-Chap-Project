"use client"
import Image from "next/image";
import { Music, Square } from 'lucide-react';
import {
  useState,
  useRef,
  useCallback,
  useEffect,
  ChangeEventHandler,
} from "react";

export default function Home() {
  const chingRef = useRef<HTMLAudioElement | null>(null);
  const chapRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [tap1, setTap1] = useState<number| null>(null);
  const [tap2, setTap2] = useState<number| null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChap, setIsChap] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [length, setLength] = useState<number | null>(0);

  const play = useCallback(() => {
    if (isChap) {
        if(stopRequested) {
          stop();   
        }      
        if (chapRef.current) {
          chingRef.current?.pause();
          chapRef.current.currentTime = 0;
          chapRef.current.play();
          console.log('Playing CHAP');
        }

    } else {
       if (!stopRequested) {
        if (chingRef.current) {
          chapRef.current?.pause();
          chingRef.current.currentTime = 0;
          chingRef.current.play();
          console.log('Playing CHING');
        }          
       }  else {
        stop();   
      }

    }
    setIsChap((prev) => !prev);
  }, [isChap, stopRequested]);

  const handleTap = () => {
    if (!isPlaying) {
      if (tap1 === null) {
        console.log('first press')
        setTap1(Date.now());
        if (chingRef.current) {
          chingRef.current.currentTime = 0;
          chingRef.current.play();
        }
        setIsChap(true);  // Next sound will be chap
      } else {
        console.log('second press')
        setTap2(Date.now());
        chingRef.current?.pause();
        if (chapRef.current) {
          chapRef.current.currentTime = 0;
          chapRef.current.play();
        }
        setIsChap(false);  // Next sound will be ching
      }
    }
  }

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
      setStopRequested(()=>(true));
      console.log('Stop requested, will stop after next CHAP');
    }
  }

  const stop = () => {
    chingRef.current?.pause();
    chapRef.current?.pause();    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setTap1(null);
    setTap2(null);
    setIsChap(false);
    setStopRequested(false);
    console.log('Stopped after CHAP');
    return;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-5 text-white">
      <audio ref={chingRef} src="/ChingSample.mp3" />
      <audio ref={chapRef} src="/ChapSample.mp3" />
      
      <h1 className="text-4xl font-bold mb-8">Ching-Chap Metronome</h1>
      <p className="text-2xl font-semibold mb-4">{isPlaying ? 'Press stop to end' : 'Press twice to begin'}</p>
      
      <div className="flex flex-col items-center space-y-8">
        <button 
          className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            isPlaying ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleTap}
        >
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
          <p className="text-4xl font-bold">{length ? `${length / 1000} second` : '--'}</p>
          <p className="text-xl">{length ? `${Math.round(60000 / length)} BPM` : '--'}</p>
        </div>
      </div>
    </main>    
  );
}