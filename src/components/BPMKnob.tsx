"use client"
import { CircularKnob } from "./CircularKnob";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";

interface BPMKnobProps {
    length: number | null;
    bpmKnobValue: number;
    handleBpmChange: (value: number) => void;
  }
  
export const BPMKnob: React.FC<BPMKnobProps> = ({ length, bpmKnobValue, handleBpmChange }) => {
    const { t } = useTranslation();  
    const [bpmText, setBPM] = useState<number>(bpmKnobValue);

    useEffect(()=>{
      setBPM(bpmKnobValue)
    }, [bpmKnobValue])

    useEffect(()=>{
      if(length){
        setBPM(Math.round(60000 * 10 / length ) / 10)
      }
    }, [length])

    return (
      <div className="text-center space-y-2">
        <p className="text-select-none text-2xl font-semibold sm:text-3xl ">{t("Current Tempo")}</p>
        <p className="text-select-none text-2xl font-bold sm:text-3xl ">
          {length ? `${(length / 1000).toFixed(2)} ${t("second")}` : "--"}
        </p>
        <div className="text-select-none flex space-x-1 items-center justify-center">
        <div className="text-select-none flex flex-col items-center space-y-3">
          <p className="text-select-none text-xl font-semibold">{t("Adjust BPM")}</p>
          <CircularKnob
            length={length}
            value={bpmKnobValue}
            min={10}
            max={250}
            onChange={handleBpmChange}
          />
          <p className="text-select-none text-xl font-bold">{bpmText.toFixed(1)} BPM</p>
        </div>
        </div>
      </div>



    );
  };
  
