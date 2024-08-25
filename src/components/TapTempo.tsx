"use client"
import React, { useState } from 'react';


const TapTempo = ({ onTempoChange }: any) => {
    const [clickTimes, setClickTimes] = useState([]);
  
    const handleClick = () => {
      const now = Date.now();
      setClickTimes(prevTimes => {
        const updatedTimes = [...prevTimes, now];
        
        if (updatedTimes.length > 1) {
          const timeDifferences = updatedTimes.slice(1).map((time, index) => time - updatedTimes[index]);
          const averageInterval = timeDifferences.reduce((acc, diff) => acc + diff, 0) / timeDifferences.length;
          const tempo = (60 * 1000) / averageInterval;
          
          onTempoChange(Math.round(tempo));
        }

        if (updatedTimes.length === 5) {
            return [];
        }
  
        return updatedTimes.slice(-10); // Keep only the last 10 times to make the tempo more stable


      });
    };
  
    return (
      <button onClick={handleClick} style={styles.button}>
        Tap Tempo
      </button>
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
    }
  };
  
  export default TapTempo;