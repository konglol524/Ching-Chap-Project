import { Lock, Unlock, Square } from "lucide-react";

interface StopButtonsProps {
  isPlaying: boolean;
  handleStop: () => void;
}

export const StopButton: React.FC<StopButtonsProps> = ({ isPlaying, handleStop }) => {
  return (

      <button
        className={`w-24 h-24 rounded-full flex items-center justify-center text-xl transition-transform transform hover:scale-105 active:scale-95 shadow-lg ${
          isPlaying
            ? "bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700"
            : "bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-800"
        }`}
        onClick={handleStop}
      >
        <Square size={36} />
      </button>
  );
};
