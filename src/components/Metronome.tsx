"use client";
import { useContext, useState, useRef, useCallback, useEffect } from "react";
import { AudioContext, initAudioContext } from "./AudioContextProvider";
import { Music, Square, Lock, Unlock } from "lucide-react";
import { requestWakeLock } from "@/utils/wakelock";

export const Metronome = () => {
  const audioCtx = useContext(AudioContext);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null); 

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChap, setIsChap] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [tap1, setTap1] = useState<number | null>(null);
  const [tap2, setTap2] = useState<number | null>(null);
  const [length, setLength] = useState<number | null>(0);
  const [stopRequested, setStopRequested] = useState(false);


  const playSound = useCallback((buffer: AudioBuffer | null) => {

    if (!audioCtx?.audioContext || !buffer || !audioCtx.gainNode) return;

    if(currentSourceRef.current){
        currentSourceRef.current.stop(); //stop sound before playing new sound
    }
    const source = audioCtx.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.gainNode);
    audioCtx.gainNode.connect(audioCtx.audioContext.destination);
    source.start(0);
    currentSourceRef.current = source;
  }, [audioCtx]);

  const play = useCallback(() => {
    if (!audioCtx?.audioContext) return;
    if (isChap) {
        playSound(audioCtx.chapBuffer); // Play Chap sound
        if (stopRequested) {
          stop();
        } 
    } else {
      if (stopRequested) {
        stop();
      } else {
        playSound(audioCtx.chingBuffer); // Play Ching sound
      }
    }
    setIsChap((prev) => !prev);
  }, [isChap]);

  const handleTap = () => {
    if(!audioCtx) return;
    if(isManual){
      stop();
    }

    if (!isPlaying) {
      if (tap1 === null) {
        setTap1(Date.now());
        playSound(audioCtx.chingBuffer);
        setIsChap(true);
      } else {
        setTap2(Date.now());
        playSound(audioCtx.chapBuffer); // Second tap plays chap
        setIsChap(false); // Next sound will be ching
      }
    } else {
      if (tap1 && tap2){
        if(currentSourceRef.current){
          currentSourceRef.current.stop(); //stop sound before playing new sound
        }
        stop(); //stop beat
        setTap1(Date.now());
        playSound(audioCtx.chingBuffer);
        setIsChap(true);
      } else if (tap1 && !tap2){
        setTap2(Date.now());
        playSound(audioCtx.chapBuffer); // Second tap plays chap
        setIsChap(false); // Next sound will be ching
      }
    }

  };

  const startChingChap = useCallback(() => {
    if(!tap1 || !tap2) return;
    const newInterval = Math.max(tap2 - tap1, 0);
    setLength(newInterval);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(play, newInterval);
    setIsPlaying(true);
    requestWakeLock(setWakeLock);
  }, [play, tap1, tap2]);

  useEffect(() => {
    if ( tap1 !== null && tap2 !== null) {
        startChingChap();  
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

  const handleManual = useCallback(()=> {
    if(isManual){
      setIsPlaying((prev)=> false);
    }
    setIsManual((prevManual) => !prevManual)
  }, []);

  return (
    <div>
      <p className="text-3xl font-semibold mb-4 sm:text-4xl">
        {isManual ? "Manual mode": isPlaying ?"Press stop to end" : "Press twice to begin"}
      </p>
      <div className="flex flex-col items-center space-y-8">
        <button
          className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 ${
            isManual ? "bg-yellow-500 hover:bg-yellow-600": isPlaying? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          } `}
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
          <button
            className={` w-8 h-8 rounded-full flex items-center justify-center text-xl 
            font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
            ${isManual ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
            onClick={handleManual}>
            {isManual ? <Lock size={20} /> : <Unlock size={20} />}
          </button>
        <div className="text-center">
          <p className="text-2xl font-semibold">Current Tempo</p>
          <p className="text-4xl font-bold">
            {length ? `${(length / 1000).toFixed(2)} second` : "--"}
          </p>
          <p className="text-xl">{length ? `${Math.round(60000 / length)} BPM` : "--"}</p>
        </div>

      </div>

    </div>
  );
};