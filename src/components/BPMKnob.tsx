"use client";
import { CircularKnob } from "./CircularKnob";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

interface BPMKnobProps {
  length: number | null;
  bpmKnobValue: number;
  handleBpmChange: (value: number) => void;
}

export const BPMKnob: React.FC<BPMKnobProps> = ({ length, bpmKnobValue, handleBpmChange }) => {
  const { t } = useTranslation();
  const [bpmText, setBPMText] = useState<number>(bpmKnobValue);

  // Synchronize bpmKnobValue to local state
  useEffect(() => {
    setBPMText(bpmKnobValue);
  }, [bpmKnobValue]);

  // Update BPM when length changes
  useEffect(() => {
    if (length) {
      const newBPM = Math.round((60000 * 10) / length) / 10; // Convert length to BPM
      handleBpmChange(newBPM); // Update bpmKnobValue in parent
    }
  }, [length]);

  // Handlers for carets
  const handleCaretDecrease = () => {
    const newBPM = Math.max(10, Math.floor(bpmKnobValue - 1)); // Prevent going below 10
    handleBpmChange(newBPM);
  };

  const handleCaretIncrease = () => {
    const newBPM = Math.min(250, Math.ceil(bpmKnobValue + 1)); // Prevent exceeding 250
    handleBpmChange(newBPM);
  };

  return (
    <div className="text-center space-y-2">
      <p className="text-select-none text-2xl font-semibold sm:text-3xl">{t("Current Tempo")}</p>
      <p className="text-select-none text-2xl font-bold sm:text-3xl">
        {length ? `${(length / 1000).toFixed(2)} ${t("second")}` : "--"}
      </p>
      <div className="text-select-none flex space-x-1 items-center justify-center">
        {/* Left Caret */}
        <button
          onClick={handleCaretDecrease}
          className="text-4xl text-gray-700 hover:text-blue-500 transition-transform transform active:scale-90"
          style={{ fontSize: "2rem" }} // Half the size of the knob
          aria-label="Decrease BPM"
        >
          &lt;
        </button>

        {/* Circular Knob */}
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

        {/* Right Caret */}
        <button
          onClick={handleCaretIncrease}
          className="text-4xl text-gray-700 hover:text-blue-500 transition-transform transform active:scale-90"
          style={{ fontSize: "2rem" }} // Half the size of the knob
          aria-label="Increase BPM"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};
