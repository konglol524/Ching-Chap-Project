// components/PlayButton.js
import React, { useEffect, useRef, useState } from 'react';

const PlayButton = ({ bpm, audioSrc } :{bpm:number; audioSrc:string}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null >(null);

  useEffect(() => {
    if (isPlaying) {
      // Calculate the interval based on the BPM
      const interval = (60 / bpm) * 1000;

      // Set up an interval to play the audio at the correct BPM
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
      }, interval);
    } else {
      // Clear the interval when the sound should stop
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup the interval when the component unmounts or BPM changes
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [bpm, isPlaying]);

  useEffect(() => {
    // Recreate the audio object whenever audioSrc changes
    audioRef.current = new Audio(audioSrc);
  }, [audioSrc]);

  const handleClick = () => {
    if (!audioRef.current) {
      // Initialize the audio object when the button is clicked for the first time
      audioRef.current = new Audio(audioSrc);
    }
    setIsPlaying(prevState => !prevState);
  };

  return (
    <div>
      <button onClick={handleClick} style={styles.button}>
        {isPlaying ? 'Stop' : 'Play'} Sound
      </button>
    </div>
  );
};

const styles = {
  button: {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'transform 0.1s ease-in-out',
    marginTop: '20px',
  }
};

export default PlayButton;
