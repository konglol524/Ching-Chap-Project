"use client";

import { useTranslation } from 'next-i18next';
import { usePathname, useRouter } from "next/navigation";
import { AudioContext} from "./AudioContextProvider";
import { useContext } from 'react';

export const LanguageToggle = () => {
    const audioCtx = useContext(AudioContext);
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLocale = i18n.language;
    const newLocale = currentLocale === "th" ? "en" : "th";

    // Remove the current locale prefix (if exists) and add the new locale prefix
    const strippedPath = pathname.replace(`/${currentLocale}`, "");
    const newPath = `/${newLocale}${strippedPath}`;
    audioCtx?.closeAudio();
    router.push(newPath); // Push the new locale path
  };

  return (
    <button
    onClick={toggleLanguage}
    className="ml-4 px-4 py-2  bg-gray-800 text-white font-medium text-sm rounded-md hover:bg-gray-700 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
  >
      {i18n.language === "en" ? "TH" : "EN"}
    </button>
  );
};
