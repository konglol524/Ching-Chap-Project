"use client"
import { useTranslation } from "next-i18next";

interface BPMDisplayProps {
    length: number | null;
    bpmInput: number | null;
    setBpmInput: (value: number) => void;
  }
  
export const BPMDisplay: React.FC<BPMDisplayProps> = ({ length, bpmInput, setBpmInput }) => {
  const { t } = useTranslation();  
  return (
      <div className="text-center space-y-2">
        <p className="text-select-none text-2xl font-semibold sm:text-3xl ">{t("Current Tempo")}</p>
        <p className="text-select-none text-2xl font-bold sm:text-3xl ">
          {length ? `${(length / 1000).toFixed(2)} ${t("second")}` : "--"}
        </p>
        <div className="text-select-none flex space-x-1 items-center justify-center">
        <input
          type="number"
          value={length ? Math.round(60000 / length) : ""}
          readOnly
          placeholder="---"
          className="text-select-none text-xl font-bold w-16 text-center p-1 border border-gray-300 rounded-md text-black pointer-events-none"
        />
          <div className="text-select-none text-xl">BPM</div>
        </div>
      </div>
    );
  };
  