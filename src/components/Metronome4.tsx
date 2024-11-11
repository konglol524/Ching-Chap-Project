"use client";
import { useContext, useState, useRef, useEffect } from "react";
import { AudioContext } from "./AudioContextProvider";
import { Music, Square, Lock, Unlock } from "lucide-react";
import { requestWakeLock } from "@/utils/wakelock";
import { useTranslation } from "next-i18next";
import { CircularKnob } from "./CircularKnob";

export const Metronome4 = () => {
  const { t } = useTranslation();
  const audioCtx = useContext(AudioContext);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const isChap = useRef<boolean>(false);
  const stopRequested = useRef<boolean>(false);

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [tap1, setTap1] = useState<number | null>(null);
  const [tap2, setTap2] = useState<number | null>(null);
  const [firstTap, setTap] = useState(true);
  const [length, setLength] = useState<number | null>(0);
  const [bpmInput, setBpmInput] = useState<number | null>(null);
  const [bpmKnobValue, setBpmKnobValue] = useState<number>(120); // State for BPM knob

  const playSound = (buffer: AudioBuffer | null)=>{
    if (!audioCtx?.audioContext || !buffer || !audioCtx.gainNode) return;
      currentSourceRef.current?.stop(); // Stop previous sound
      const source = audioCtx.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.gainNode).connect(audioCtx.audioContext.destination);
      source.start(0);
      currentSourceRef.current = source;
    }

  const play = ()=>{
    if (!audioCtx?.audioContext) return;
    if (!isChap.current && stopRequested.current){
        stop();
    } else {
        playSound(isChap.current ? audioCtx.chapBuffer : audioCtx.chingBuffer);  
    }
    isChap.current = !isChap.current;
  };

  const handleTap = () => {
    if (!audioCtx) return;
    audioCtx.audioContext?.resume();
    const now = Date.now();
    if(isManual) stop();
    if(firstTap){
        stop();
        setTap1(now);
        playSound(audioCtx.chingBuffer);
    } else {
        setTap2(now);
        playSound(audioCtx.chapBuffer);
    }
    setTap((prev) => !prev);
  };

  const startChingChap = () => {
    if (!tap1 || !tap2) return;
    const newInterval = Math.max(tap2 - tap1, 0);
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(play, newInterval);
    requestWakeLock(setWakeLock);
  };

  useEffect(() => {
    if (tap1 !== null && tap2 !== null){
      const newInterval = Math.max(tap2 - tap1, 0);
      setLength(newInterval);
      startChingChap();
      setIsPlaying(true);
    } 
  }, [tap2]);

  const stop = () => {
    clearInterval(intervalRef.current!);
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
      stop();
    }
    setIsManual((prev) => !prev);
  };

  // Calculate length based on BPM input or knob value
  useEffect(() => {
    const bpmValue = bpmInput ? bpmInput : bpmKnobValue;
    if (bpmValue && !isNaN(Number(bpmValue))) {
      if (bpmValue > 0) {
        const newLength = 60000 / bpmValue; // Convert BPM to milliseconds
        setLength(newLength); // Update length state
        if (isPlaying) {
          clearInterval(intervalRef.current!);
          intervalRef.current = setInterval(play, newLength);
        }
      }
    } else {
      setLength(null); // Reset length if input is cleared
    }
  }, [bpmInput, bpmKnobValue]);

  const startFromBpm = () => {
    if (!audioCtx) return;
    stop();
    audioCtx.audioContext?.resume();
    if (!length) return;
    setIsManual(false);
    playSound(audioCtx.chingBuffer);
    isChap.current = true;
    setTap1(Date.now());
    setTap2(Date.now() + length);
  };

  const handleBpmChange = (value: number) => {
    setBpmKnobValue(value);
  };

  return (
<div className="text-center mt-5">
  <p className="text-select-none text-xl font-semibold mb-5 sm:text-4xl">
    {isManual ? t("Manual mode") : isPlaying ? t("Press stop to end") : t("Press twice to begin")}
  </p>
  <div className="flex flex-col items-center space-y-7 sm:space-y-10"> {/* Increased space-y for more separation */}
    <button
className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
  isManual 
    ? (firstTap 
      ? "bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-700" 
      : "bg-gradient-to-br from-purple-600 to-purple-400 shadow-lg shadow-purple-900")
    : (isPlaying 
      ? "bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700" 
      : (firstTap
        ?"bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-800" 
        : "bg-gradient-to-br from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-700" )
      )
  }`}
      onClick={handleTap}
    >
      <Music size={48} />
    </button>
    
    <button
      className={`w-24 h-24 rounded-full flex items-center justify-center text-xl transition-transform transform hover:scale-105 active:scale-95 shadow-lg 
              ${isPlaying ? 
        "bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700"
        : "bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-800"}
      `}
      onClick={handleStop}
    >
      <Square size={36} />
    </button>

    <div className="flex items-center justify-center space-x-10">
      <button
        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform transform hover:scale-105 active:scale-95 ${
          isManual
            ? "bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-800"
            : "bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-800"
        }`}
        onClick={handleManual}
      >
        {isManual ? <Lock size={20} /> : <Unlock size={20} />}
      </button>
      
      <button
        className="text-select-none w-12 h-12 rounded-full flex items-center justify-center transition-transform transform hover:scale-105 active:scale-95 bg-gradient-to-br from-blue-600 to-red-400 shadow-lg shadow-gray-800"
        onClick={startFromBpm}
      >
        BPM
      </button>
    </div>

    <div className="text-center space-y-2"> {/* Added space-y for separation */}
      <p className="text-select-none text-2xl font-semibold sm:text-3xl ">{t("Current Tempo")}</p>
      <p className="text-select-none text-2xl font-bold sm:text-3xl ">
      {length ? `${(length / 1000).toFixed(2)} ${t('second')}` : "--"}
      </p>
      <div className="text-select-none flex space-x-1 items-center justify-center">
        <input
          type="number"
          value={length ? Math.round(60000 / length) : ""}
          onChange={(e) => setBpmInput(Number(e.target.value))}
          placeholder="---"
          className="text-select-none text-xl font-bold w-16 text-center p-1 border border-gray-300 rounded-md text-black"
        />
        <div className="text-select-none text-xl">
          BPM
        </div>
      </div>
    </div>

    {/* BPM Knob Slider Component */}
    <div className="flex flex-col items-center space-y-3 mt-5">
      <p className="text-select-none text-lg font-semibold">{t("Adjust BPM")}</p>
      <CircularKnob
        value={bpmKnobValue}
        min={1}
        max={400}
        onChange={handleBpmChange}
      />
      <p className="text-select-none text-xl font-bold">{bpmKnobValue.toFixed(2)} BPM</p>
    </div>
  </div>
</div>
  );
};
