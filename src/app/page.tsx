"use client"
import Image from "next/image";
import PlayButton from "@/components/PlayButton";
import TapTempo from "@/components/TapTempo";
import { useState, ChangeEvent } from "react";

export default function Home() {
  const [tempo, setTempo] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState('/met1.mp3');

  const handleTempoChange = (newTempo:any) => {
    setTempo(newTempo);
  };

  const handleInputChange = (e :ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setTempo(value);
    }
  };

  const handleAudioChange = (e:ChangeEvent<HTMLInputElement>) => {
    setSelectedAudio(e.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-xl"> Ching-Chap </h1>
      
      <div style={styles.audioSelector}>
        <label>
          <input 
            type="radio" 
            value="/met.mp3" 
            checked={selectedAudio === '/met.mp3'}
            onChange={handleAudioChange} 
          />
          Metronome 1
        </label>
        <label>
          <input 
            type="radio" 
            value="/ching.mp3" 
            checked={selectedAudio === '/ching.mp3'}
            onChange={handleAudioChange} 
          />
          Metronome 2
        </label>
        <label>
          <input 
            type="radio" 
            value="/met3.mp3" 
            checked={selectedAudio === '/met3.mp3'}
            onChange={handleAudioChange} 
          />
          Metronome 3
        </label>
      </div>

      <PlayButton bpm={tempo} audioSrc={selectedAudio}/>

      <TapTempo onTempoChange={handleTempoChange}/>

            {/* Input Field to Manually Set BPM */}
      <input 
        type="number" 
        value={tempo} 
        onChange={handleInputChange} 
        placeholder="Enter BPM" 
        style={styles.input} 
      />


      <p>Current Tempo: {tempo} BPM</p>
    </main>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    padding: '10px',
    margin: '20px 0',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '150px',
  },
  audioSelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
};