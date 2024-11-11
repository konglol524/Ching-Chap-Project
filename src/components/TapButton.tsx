// TapButton.tsx
import { Music } from "lucide-react";

interface TapButtonProps {
   isPlaying: boolean;
  isManual: boolean;
  firstTap: boolean;
  handleTap: () => void;
}

export const TapButton: React.FC<TapButtonProps> = ({isPlaying, isManual, firstTap, handleTap }) => {
  return (
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

  );
};
