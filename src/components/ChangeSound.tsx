"use client";
import { useContext } from "react";
import { AudioContext } from "./AudioContextProvider";
import { Volume2, VolumeOff } from "lucide-react";
import { loadSound } from "@/utils/loadsound";
import { useTranslation } from "react-i18next";

export const ChangeSound = () => {
  const audioCtx = useContext(AudioContext);
  const { t } = useTranslation();
  if (!audioCtx ||!audioCtx?.audioContext) return null;

  const changeSound = (selectedOption: string) => {
    if (selectedOption === "duriyaban") {
      loadSound("/Chingduriya.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
      loadSound("/Chapduriya.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
    } else if (selectedOption === 'duriyaban ching'){
      loadSound("/Chingduriya.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
      loadSound("/Chingduriya.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
    } else if (selectedOption === 'duriyaban chap'){
      loadSound("/Chapduriya.mp3", audioCtx.audioContext).then(audioCtx.setChingBuffer);
      loadSound("/Chapduriya.mp3", audioCtx.audioContext).then(audioCtx.setChapBuffer);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeSound(event.target.value);
  };


  return (
    <div className="flex items-center space-x-1 mt-4">
      <label htmlFor="sound-selector" className="text-select-none text-lg font-bold">
        {t('Select Sound')}:
      </label>
      <select
        id="sound-selector"
        onChange={handleChange}
        defaultValue="duriyaban"
        className="p-2 rounded border-2 border-gray-600 bg-white text-black"
      >
        <option value="duriyaban">{t('Duriyaban')}</option>
        <option value="duriyaban ching">{t('Duriyaban Ching')}</option>
        <option value="duriyaban chap">{t('Duriyaban Chap')}</option>        
      </select>
    </div>
  );
};