import { Lock, Unlock, Square } from "lucide-react";

interface ManualButtonProps {
  handleManual: () => void;
  isManual: boolean;
}

export const ManualButton: React.FC<ManualButtonProps> = ({ handleManual, isManual }) => {
  return (
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

  );
};
