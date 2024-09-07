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

  const play = useCallback(()=>{
    if(isChap){
      //Play Chap
      if (chapRef.current) {
        chapRef.current.play();
        console.log('Playing CHAP');
      }
      if (chingRef.current) {
        chingRef.current.pause();
        chingRef.current.currentTime = 0;
      }
    } else {
      //Play Ching
      if (chingRef.current) {
        chingRef.current.play();
        console.log('Playing CHING');
      }
      if (chapRef.current) {
        chapRef.current.pause();
        chapRef.current.currentTime = 0;
      }
    }
  }, [isChap]);

  const handleTap = ()=>{
    // chingRef.current = new Audio('/ching.mp3');
    if(!isPlaying){
      if(!isChap){
        //First press - start timer
        console.log('first press')
        setTap1(Date.now());
        setTap2(null);        
        play();
        setIsChap(!isChap);
      } else {
        console.log('second press')
        //Second press - calculate interval and start playing
        setTap2(Date.now());
      }
    }
      
  }

  const startChingChap = (interval:number)=>{
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      play();
      setIsChap(!isChap);
    }, interval);
  } 

  useEffect(() => {
    if (tap1 !== null && tap2 !== null) {
      // Calculate interval when tap2 is updated
      const newInterval = (tap2 - tap1);
      play();
      setIsChap(prev => !prev);
      console.log(newInterval);
      startChingChap(newInterval);
      setIsPlaying(true);
    }
  }, [tap2]); // Dependency on tap2 to recalculate when it changes


  const handleStop = ()=>{

    if (isPlaying){
      //wait untill the next chap and then stop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      //set isPlaying to false
      setIsPlaying(false);
    }
    //disable it when isPlaying is false
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <audio ref={chingRef} src="/ching.mp3" />
        <audio ref={chapRef} src="/met.mp3" />
        <div className="flex flex-col items-center"></div> 
  
        <button className=" bg-red-500 w-20 h-20 rounded-full"
          onClick={handleTap}>
          TAP 
        </button>

        <button className=" bg-red-500 w-20 h-20 rounded-full"
          onClick={handleStop}>
          STOP
        </button>

      {/* calculate BPM then display <p>Current Tempo: {tempo} BPM</p> */}
    </main>      

  );
};