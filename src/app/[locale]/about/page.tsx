"use client";
import { Music, Square, Lock } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function About() {
  const { t } = useTranslation();
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-red-900 p-5 text-white">
      {/* Title */}
      <h1 className="text-xl font-bold mb-8 sm:text-4xl mt-12 sm:mt-4">{t("About:about")}</h1>

      <div className="max-w-[80vh]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Play Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-700 rounded-full flex items-center justify-center mb-4">
              <Music size={40} />
            </div>
            <p className="text-xl font-semibold">{t("About:PlayButton")}</p>
            <p className="text-center text-sm">
            {t("About:Playtext")}
            </p>
          </div>

          {/* Stop Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700 rounded-full flex items-center justify-center mb-4">
              <Square size={40} />
            </div>
            <p className="text-xl font-semibold">{t("About:StopButton")}</p>
            <p className="text-center text-sm">
            {t("About:Stoptext")}
            </p>
          </div>

          {/* Lock Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-700">
              <Lock size={40} />
            </div>
            <p className="text-xl font-semibold">{t("About:ManualButton")}</p>
            <p className="text-center text-sm">
            {t("About:Manualtext")}
            </p>
          </div>

          {/* BPM Button (Centered) */}
          <div className="flex flex-col items-center col-span-1 sm:col-span-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-600 to-red-400 shadow-lg shadow-gray-700">
              BPM
            </div>
            <p className="text-xl font-semibold">{t("About:BPMButton")}</p>
            <p className="text-center text-sm">
            {t("About:BPMtext")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8">
        <a
          href="https://github.com/konglol524"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-white underline hover:text-gray-300"
        >
          {t("About:Credit")}
        </a>
      </footer>
    </main>
  );
}