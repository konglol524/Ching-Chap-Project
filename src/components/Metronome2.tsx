"use client";
import { useContext, useState, useRef, useEffect } from "react";
import { AudioContext, AudioContextType } from "./AudioContextProvider";
import { requestWakeLock } from "@/utils/wakelock";
import { useTranslation } from "next-i18next";
import {TapButton} from "./TapButton";
import { StopButton } from "./StopButton";
import { ManualButton } from "./ManualButton";
import { BPMDisplay } from "./BPMDisplay";
import { BPMKnob } from "./BPMKnob";

export const Metronome = () => {
  const { t } = useTranslation();
  const audioCtxConfig = useContext(AudioContext);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isChap = useRef<boolean>(false);
  const stopRequested = useRef<boolean>(false);

  const audioCtx = useRef<AudioContextType | null>(null);
//   if (audioCtxRef.current === null && audioCtx) {
//     audioCtxRef.current = audioCtx;
//   }
  useEffect(()=>{
    audioCtx.current = audioCtxConfig
  }, [audioCtxConfig])

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [tap1, setTap1] = useState<number | null>(null);
  const [tap2, setTap2] = useState<number | null>(null);
  const [firstTap, setTap] = useState(true);
  const [length, setLength] = useState<number | null>(0);
  const [bpmInput, setBpmInput] = useState<number | null>(null);
  const [bpmKnobValue, setBpmKnobValue] = useState<number>(120); // State for BPM knob
  const isPlayingRef = useRef(isPlaying);
  const lengthRef = useRef(length);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(()=>{
    if(length){
      lengthRef.current = length;
      if(60000 / length < 5){
        stop();
      }      
    }

  }, [length])

  const playSound = (buffer: AudioBuffer | null) => {
    if (!audioCtx.current?.audioContext || !buffer || !audioCtx.current.gainNode) return;
    currentSourceRef.current?.stop(); // Stop previous sound
    const source = audioCtx.current.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.current.gainNode).connect(audioCtx.current.audioContext.destination);
    source.start(0);
    currentSourceRef.current = source;
  };

  const play = () => {
    if (!audioCtx.current?.audioContext || !lengthRef.current) return;
    if (!isChap.current && stopRequested.current) {
      stop();
    } else {
        playSound(isChap.current ? audioCtx.current.chapBuffer : audioCtx.current.chingBuffer);  
        if(isPlayingRef.current){
            timeoutRef.current = setTimeout(() => {
                play();
            }, lengthRef.current);        
        }      
    }
    isChap.current = !isChap.current;

  };

  const handleTap = () => {
    if (!audioCtx.current) return;
    audioCtx.current.audioContext?.resume();
    currentSourceRef.current?.stop(); 
    const now = Date.now();
    if (isManual) stop();
    if (firstTap) {
      stop();
      setTap1(now);
      playSound(audioCtx.current.chingBuffer);
    } else {
      setTap2(now);
      playSound(audioCtx.current.chapBuffer);
    }
    setTap((prev) => !prev);
  };

  const startChingChap = () => {
    if (!tap1 || !tap2) return;
    const newInterval = Math.max(tap2 - tap1, 0);
    requestWakeLock(setWakeLock);
        //change to set timeout
    setIsPlaying(true);     
    setLength(newInterval);
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(play, newInterval);
    
  };

  useEffect(() => {
    //change to set timeout
    if (tap1 !== null && tap2 !== null) {
        startChingChap();
      } 
  }, [tap2]);

  const stop = () => {
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
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
      //const lastSound = isChap.current
      stop();
      //isChap.current = lastSound
    }
    setIsManual((prev) => !prev);
  };

  useEffect(() => {
    const bpmValue = bpmInput ? bpmInput : bpmKnobValue;
    if (bpmValue && !isNaN(Number(bpmValue))) {
      if (bpmValue > 0) {
        const newLength = 60000 / bpmValue; // Convert BPM to milliseconds
        setLength(newLength); // Update length state
      }
    } else {
      setLength(null); // Reset length if input is cleared
    }
  }, [bpmInput, bpmKnobValue]);

  const startFromBpm = () => {
    if (!audioCtx.current) return;
    stop();
    audioCtx.current.audioContext?.resume();
    if (!length) return;
    setIsManual(false);
    playSound(audioCtx.current.chingBuffer);
    isChap.current = true;
    setTap1(Date.now());
    setTap2(Date.now() + length);
  };

  const handleBpmChange = (value: number) => {
    setBpmKnobValue(value);
  };

  return (
    <div className="text-select-none text-center mt-5">
      <p className=" text-xl font-semibold mb-5 sm:text-4xl">
        {isManual ? t("Manual mode") : isPlaying ? t("Press stop to end") : t("Press twice to begin")}
      </p>
      <div className="text-select-none flex flex-col items-center space-y-7 sm:space-y-8">
        <TapButton isPlaying={isPlaying} isManual={isManual} firstTap={firstTap} handleTap={handleTap} />
        <StopButton isPlaying={isPlaying} handleStop={handleStop} />

        <div className="flex items-center justify-center space-x-10">
        <ManualButton handleManual={handleManual} isManual={isManual} />
        <button
          className="text-select-none w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 bg-gradient-to-br from-blue-600 to-red-400 shadow-lg shadow-gray-800"
          onClick={startFromBpm}
        >
          BPM
        </button>
            
        </div>

        <BPMDisplay length={length} bpmInput={bpmInput} setBpmInput={setBpmInput} />
        <BPMKnob length={length} bpmKnobValue={bpmKnobValue} handleBpmChange={handleBpmChange} />
      </div>
    </div>
  );
};