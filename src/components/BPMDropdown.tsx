import React, { FC, useState, useEffect, useRef } from "react";
import { User } from "firebase/auth";
import { onAuthStateChangedHelper, getUserPresets, updateUserPresets } from "../firebase/firebase";

interface BPMDropdownProps {
  onBpmChange: (bpm: number) => void;
  currentBpm: number;
}

export const BPMDropdown: FC<BPMDropdownProps> = ({ onBpmChange, currentBpm }) => {
  // State management
  const [bpmOptions, setBpmOptions] = useState<number[]>([120, 100, 80, 60, 40]);
  const [user, setUser] = useState<User | null>(null);
  const [newBpm, setNewBpm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [authChanged, setAuthChanged] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load user presets on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper(async (user) => {
      setUser(user);
      if (user) {
        setBpmOptions(await getUserPresets(user));
      } else {
        // Reset to defaults when logged out
        setBpmOptions([120, 100, 80, 60, 40]);
        
        // Close any open UI elements
        setIsDropdownOpen(false);
        setIsAddModalOpen(false);
      }
    });
    return unsubscribe;
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Handlers
  const handleSelectBpm = (bpm: number) => {
    onBpmChange(bpm);
    setIsDropdownOpen(false);
  };

  const handleDeleteBpm = async (bpm: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!user) return;
    
    const newPresets = bpmOptions.filter(option => option !== bpm);
    setBpmOptions(newPresets);
    await updateUserPresets(user, newPresets);
  };

  const handleAddBpm = async () => {
    if (!user || !newBpm) return;

    const bpmValue = Math.round(parseFloat(newBpm) * 10)/ 10;
    // Validation
    if (isNaN(bpmValue) || bpmValue < 10 || bpmValue > 250) {
      alert("Please enter a valid BPM between 10 and 250.");
      return;
    }
    
    if (bpmOptions.includes(bpmValue)) {
      alert("This BPM is already in your list.");
      return;
    }
    
    if (bpmOptions.length >= 10) {
      alert("You cannot add more than ten options.");
      return;
    }

    // Update presets
    const updatedPresets = [...bpmOptions, bpmValue].sort((a, b) => a - b);
    setBpmOptions(updatedPresets);
    await updateUserPresets(user, updatedPresets);
    
    // Close modal and reset input
    setIsAddModalOpen(false);
    setNewBpm("");
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setNewBpm("");
  };

  // Render components
  const renderDropdownOptions = () => (
    <div className="absolute z-10 w-34 bg-white border rounded-md shadow-lg mt-1">
      <ul className="max-h-40 overflow-y-auto">
        {bpmOptions.map(bpm => (
          <li
            key={bpm}
            className="text-sm flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handleSelectBpm(bpm)}
          >
            <span className="text-black">{bpm} BPM</span>
            {user && (
              <button 
                onClick={(e) => handleDeleteBpm(bpm, e)} 
                className="text-red-500 ml-2"
              >
                ✖
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderAddModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white p-4 rounded-md">
        <input
          type="number"
          placeholder="Enter BPM"
          value={newBpm}
          onChange={(e) => setNewBpm(e.target.value)}
          className="w-32 px-2 py-1 border rounded-md text-gray-700 mb-2"
          min="10"
          max="250"
        />
        <div className="flex justify-end space-x-2">
          <button 
            onClick={closeModal}
            className="px-3 py-1 bg-gray-300 text-black rounded-md"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddBpm}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-2">
      <label className="text-white-600 text-sm font-semibold">
        Select BPM
      </label>
      
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsDropdownOpen(prev => !prev)}
          className="mr-2 w-35 px-3 py-2 border rounded-md text-white-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentBpm} BPM {isDropdownOpen ? "▲" : "▼"}
        </button>
        
        {isDropdownOpen && renderDropdownOptions()}
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="font-bold px-3 py-2 border rounded-md text-blue-500 hover:bg-blue-100 focus:outline-none"
        >
          +
        </button>
      </div>
      
      {isAddModalOpen && renderAddModal()}
    </div>
  );
};