"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react"; // optional icon

export const DropdownNavigator = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => setIsOpen((prev) => !prev);
  
    return (
      <header className="w-full bg-gray-800 bg-opacity-70 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo or Title */}
        <a href="/">          
          <div className="text-white text-md sm:text-2xl font-bold">
            Ching-Chap Metronome   
          </div>
   </a>
          {/* Dropdown Button */}
          <div className="relative inline-block text-left">
            <button
              onClick={toggleDropdown}
              className="inline-flex justify-center w-full px-4 py-2 bg-gray-900 bg-opacity-60 text-white font-medium text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Menu <ChevronDown className="ml-2" />
            </button>
  
            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Current Version
                  </a>
                  <a
                    href="/v1"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Version 1
                  </a>
                  <a
                    href="/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    About
                  </a>

                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  };