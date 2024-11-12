// TapButton.tsx
import { useState } from "react";
import { Music } from "lucide-react";

interface TapButtonProps {
  isPlaying: boolean;
  isManual: boolean;
  firstTap: boolean;
  handleTap: () => void;
}

export const TapButton: React.FC<TapButtonProps> = ({
  isPlaying,
  isManual,
  firstTap,
  handleTap,
}) => {
  const [useTap, setUseTap] = useState(true);

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        className={`w-32 h-32 rounded-full flex items-center justify-center text-xl font-semibold transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
          isManual
            ? firstTap
              ? "bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-700"
              : "bg-gradient-to-br from-purple-600 to-purple-400 shadow-lg shadow-purple-900"
            : isPlaying
            ? "bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700"
            : firstTap
            ? "bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-800"
            : "bg-gradient-to-br from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-700"
        }`}
        onClick={useTap ? undefined : handleTap}
        onTouchStart={useTap ? handleTap : undefined}
      >
        <Music size={48} />
      </button>

      {/* Toggle to switch between tap and click */}
      <div className="flex items-center space-x-2">
        <label htmlFor="tap-toggle" className="text-lg font-medium">
          Use {useTap ? "Touch" : "Click"}
        </label>
        <input
          id="tap-toggle"
          type="checkbox"
          checked={useTap}
          onChange={() => setUseTap(!useTap)}
          className="w-6 h-6 cursor-pointer"
        />
      </div>
    </div>
  );
};
