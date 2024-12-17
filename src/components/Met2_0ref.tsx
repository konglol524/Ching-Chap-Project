"use client";
import { useContext, useState, useRef, useEffect } from "react";
import { AudioContext, AudioContextType } from "./AudioContextProvider";
import { requestWakeLock } from "@/utils/wakelock";
import { useTranslation } from "next-i18next";
import {TapButton} from "./TapButton";
import { StopButton } from "./StopButton";

export const Metronome: React.FC = () => {
    const { t } = useTranslation();
    const isChap = useRef<boolean>(false);
    const audioCtxConfig = useContext(AudioContext);
    const audioCtx = useRef<AudioContextType | null>(null);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const stopRequested = useRef<boolean>(false);
    const [length, setLength] = useState<number | null>(0);
    const lengthRef = useRef(length);
    const nextNoteTimeRef = useRef<number>(0);
    const [bpm, setBpm] = useState<number>(120);

    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);  
    const [isPlaying, setIsPlaying] = useState(false);
    const [isManual, setIsManual] = useState(false);
    const [tap1, setTap1] = useState<number | null>(null);
    const [tap2, setTap2] = useState<number | null>(null);
    const [firstTap, setTap] = useState(true);
    const [bpmKnobValue, setBpmKnobValue] = useState<number>(120); // State for BPM knob
    const isPlayingRef = useRef<boolean>(isPlaying);
    const intervalRef = useRef<number>(0);
    const secondsPerBeatRef = useRef<number>(60.0 / bpm);
    const lastBpmChangeTimeRef = useRef<number>(0);
    const lastBpmRef = useRef<number>(bpm);  
    
    useEffect(() => {
      isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(()=>{
        audioCtx.current = audioCtxConfig
    }, [audioCtxConfig])

  const playSound = (buffer: AudioBuffer | null, time: number) => {
    if (!audioCtx.current?.audioContext || !buffer || !audioCtx.current.gainNode) return;
    currentSourceRef.current?.stop(); // Stop previous sound
    const source = audioCtx.current.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.current.gainNode).connect(audioCtx.current.audioContext.destination);
    source.start(time);
    currentSourceRef.current = source;
  };

  const scheduleNotes = () => {
    if (!audioCtx.current?.audioContext) return;
    const currentTime = audioCtx.current.audioContext.currentTime || 0;

    while (nextNoteTimeRef.current < currentTime + 0.1) {
    if (!isChap.current && stopRequested.current) {
        stop();
      } else {
          playSound(isChap.current ? audioCtx.current.chapBuffer : audioCtx.current.chingBuffer, currentTime);  
          if(isPlayingRef.current){
                nextNoteTimeRef.current += secondsPerBeatRef.current;
          }      
      }
      isChap.current = !isChap.current;
    }
    // Request the next animation frame to keep scheduling
    intervalRef.current = requestAnimationFrame(scheduleNotes);
  };

  const handleTap = () => {
    if (!audioCtx.current || !audioCtx.current.audioContext) return;
    audioCtx.current.audioContext?.resume();
    currentSourceRef.current?.stop(); 
    const currentTime = audioCtx.current.audioContext.currentTime; //record tap in seconds
    if (isManual) stop();
    if (firstTap) {
      stop();
      setTap1(currentTime);
      playSound(audioCtx.current.chingBuffer, 0);
    } else {
      setTap2(currentTime);
      playSound(audioCtx.current.chapBuffer, 0);
    }
    setTap((prev) => !prev);
  };

  const startMetronome = () => {
    if (!tap1 || !tap2) return;
    const newInterval = Math.max(tap2 - tap1, 0.15); //limit max bpm by setting min length
    requestWakeLock(setWakeLock);
    setIsPlaying(true);     
    setLength(newInterval);

    if (!audioCtx.current) return;
    if (!isPlayingRef.current) {
      if (!audioCtx.current.audioContext) {
        audioCtx.current.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      isPlayingRef.current = true;
      nextNoteTimeRef.current = audioCtx.current.audioContext.currentTime;
      scheduleNotes();
    }
  };

  //updating tap2 will start the metronome
  useEffect(() => {
    //change to set timeout
    if (tap1 !== null && tap2 !== null) {
        startMetronome();
      } 
  }, [tap2]);


  const stopMetronome = () => {
    isPlayingRef.current = false;
    cancelAnimationFrame(intervalRef.current);
    setIsPlaying(false);
    setTap1(null);
    setTap2(null);
    isChap.current = false;
    stopRequested.current = false;
    if (wakeLock) {
      wakeLock.release();
    }
  };

  const handleStop = () => {
    if (isPlaying) {
      stopRequested.current = true;
    }
  };

  const handleManual = () => {
    if (isPlaying) {
        if(isChap.current){
            setTap(false)
        } else {
            setTap(true)
        }
      stop();
    }
    setIsManual((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      stopMetronome();
      // Clear the timeout on unmount to avoid memory leaks
    };
  }, []);

  return (
    <div className="text-select-none text-center mt-5">
      <div className="text-select-none flex flex-col items-center space-y-7 sm:space-y-8">
        <TapButton isPlaying={isPlaying} isManual={isManual} firstTap={firstTap} handleTap={handleTap} />
        <StopButton isPlaying={isPlaying} handleStop={handleStop} />
        <div className="flex items-center justify-center space-x-10">
        </div>
      </div>
    </div>
  );
};