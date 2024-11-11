import { CircularKnob } from "./CircularKnob";

interface BPMKnobProps {
    bpmKnobValue: number;
    handleBpmChange: (value: number) => void;
  }
  
export const BPMKnob: React.FC<BPMKnobProps> = ({ bpmKnobValue, handleBpmChange }) => {
    return (
      <div className="flex flex-col items-center space-y-3 mt-5">
        <p className="text-select-none text-lg font-semibold">{"Adjust BPM"}</p>
        <CircularKnob
          value={bpmKnobValue}
          min={1}
          max={400}
          onChange={handleBpmChange}
        />
        <p className="text-select-none text-xl font-bold">{bpmKnobValue.toFixed(2)} BPM</p>
      </div>
    );
  };
  
