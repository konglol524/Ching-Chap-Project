import React, { FC } from "react";

interface BPMDropdownProps {
  onBpmChange: (bpm: number) => void;
  currentBpm: number;
}

export const BPMDropdown: FC<BPMDropdownProps> = ({ onBpmChange, currentBpm }) => {
  const bpmOptions = [120, 100, 80, 60, 40 ]; // Frequently used BPM values

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBpm = Number(e.target.value);
    onBpmChange(selectedBpm); // Call the parent callback to update BPM
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-white-600 text-sm font-semibold" htmlFor="bpm-dropdown">
        Select BPM
      </label>
      <select
        id="bpm-dropdown"
        className="w-32 px-3 py-2 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleSelectChange}
      >
        {bpmOptions.map((bpm) => (
          <option key={bpm} value={bpm}>
            {bpm} BPM
          </option>
        ))}
      </select>
    </div>
  );
};
