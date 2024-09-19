"use client";
import { useContext } from "react";
import { AudioContext } from "./AudioContextProvider";
import { Volume2, VolumeOff } from "lucide-react";
import { loadSound } from "@/utils/loadsound";

export const ChangeSound = () => {
  const audioCtx = useContext(AudioContext);

  if (!audioCtx ||!audioCtx?.audioContext) return null;

  const changeSound = (i:number)=>{
    if(i === 1){
        loadSound("/met.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
        loadSound("/met.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
    } else if (i === 2){
        loadSound("/ChingSample.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
        loadSound("/ChapSample.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
    }
  }



  return (
    <div>
        <button className="block border-4 border-black p-5 rounded-md my-1" onClick={()=>{changeSound(1)}}> CHANGE SOUND 1 </button>
        <button className="block border-4 border-black p-5 rounded-md my-1" onClick={()=>{changeSound(2)}}> CHANGE SOUND 2 </button>
    </div>
  );
};