"use client"
import Image from "next/image";
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

  const play = useCallback(() => {
    if (isChap) {
          if (chapRef.current) {
            chingRef.current?.pause();
            chapRef.current.currentTime = 0;
            chapRef.current.play();
            console.log('Playing CHAP');
          }
          if(stopRequested){
            stop();
          }
    } else {
      if (stopRequested) {
        stop();
      }  else {
        if (chingRef.current) {
          chapRef.current?.pause();
          chingRef.current.currentTime = 0;
          chingRef.current.play();
          console.log('Playing CHING');
        }        
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <audio ref={chingRef} src="/ching.mp3" />
      <audio ref={chapRef} src="/met.mp3" />
      <div className="flex flex-col items-center"></div> 

      <button className="bg-red-500 w-20 h-20 rounded-full"
        onClick={handleTap}>
        TAP 
      </button>

      <button className="bg-red-500 w-20 h-20 rounded-full"
        onClick={handleStop}>
        STOP
      </button>

      {/* calculate BPM then display <p>Current Tempo: {tempo} BPM</p> */}
    </main>      
  );
}