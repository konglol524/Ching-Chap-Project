"use client";
import { useTranslation } from "next-i18next";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react"; 
import { LanguageToggle } from "./LanguageToggle";
import Link from "next/link";
import SignIn from "./sign-in";
import { User } from "firebase/auth";
import { checkUserExistence, onAuthStateChangedHelper} from "../firebase/firebase";

export const DropdownNavigator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const unsubscribe = onAuthStateChangedHelper(async (user) => {
        await checkUserExistence(user);
        setUser(user);
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, [] /* No dependencies, never rerun */);
  
    return (
      <header className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-red-900 bg-opacity-90 fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo or Title */}
            <div className="text-select-none text-white text-md sm:text-2xl font-bold tracking-wide hover:text-red-600 transition-colors duration-300">
              {t("Nav:logo")}
            </div>
      
          <div className="text-select-none flex items-center">
            {/* Dropdown Button */}
            <div className="relative inline-block text-left">
              <button
                onClick={toggleDropdown}
                className="inline-flex justify-center w-full px-4 py-2 bg-gray-800 text-white font-medium text-sm rounded-md hover:bg-gray-700 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
              >
                {t("Nav:menu")} <ChevronDown className="ml-2" />
              </button>
    
              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-gray-700 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a
                      href="/"
                      className="block px-4 py-2 text-sm text-white hover:bg-red-700 hover:text-white transition-colors duration-200"
                      role="menuitem"
                    >
                      {t("Nav:currentVersion")}
                    </a>
                    <a
                      href="/about"
                      className="block px-4 py-2 text-sm text-white hover:bg-red-700 hover:text-white transition-colors duration-200"
                      role="menuitem"
                    >
                      {t("Nav:about")}
                    </a>
                  </div>
                </div>
              )}
            </div>
    
            {/* Language Toggle Button */}
            <LanguageToggle/>
            <SignIn user={user} />
          </div>
        </div>
      </header>
    );
  };