import { useState, useEffect } from "react";
import { Music } from "lucide-react";
import { useTranslation } from "next-i18next";

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
  const [isMobile, setIsMobile] = useState(false);
  const [useHold, setUseHold] = useState(true);
  const { t } = useTranslation();

  // Detect if the user is on a mobile device
  useEffect(() => {
    const mobileCheck = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobileCheck);
    setUseHold(mobileCheck); // Default to true on mobile, false on desktop
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Toggle to switch between tap and click, only shown on mobile */}
      {isMobile && (
        <div className="flex items-center space-x-2">
          <label htmlFor="tap-toggle" className="text-xl font-semibold sm:text-4xl">
            {isManual ? t("Manual mode") : useHold ? t("Hold") : t("Touch")}
          </label>
          <input
            id="tap-toggle"
            type="checkbox"
            checked={useHold}
            onChange={() => setUseHold(!useHold)}
            className="w-6 h-6 cursor-pointer"
          />
        </div>
      )}
      {
        !isMobile && (
          <div className="flex items-center space-x-2">
          <label htmlFor="tap-toggle" className="text-xl font-semibold sm:text-4xl">
             {isManual ? t("Manual mode") : t("Touch") }
          </label>
        </div>
        )
      }
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
        onClick={useHold ? undefined : handleTap}
        onTouchStart={useHold ? handleTap : undefined}
        onTouchEnd={useHold ? handleTap : undefined}
      >
        <Music size={48} />
      </button>
    </div>
  );
};
