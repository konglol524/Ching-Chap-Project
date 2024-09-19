    
    // Request wake lock
export const requestWakeLock = async (setWakeLock: Function) => {
    try {
      if ('wakeLock' in navigator) {
        const wakeLockSentinel = await navigator.wakeLock.request('screen');
        setWakeLock(wakeLockSentinel);

        // Listen for when the wake lock is released
        wakeLockSentinel.addEventListener('release', () => {
          console.log('Wake lock released');
        });

        console.log('Wake lock active');
      } else {
        console.warn('Wake Lock API not supported on this browser.');
      }
    } catch (err) {
      reportError({ message: getErrorMessage(err) })
    }
  };

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
    
      // Release wake lock when metronome stops
export const releaseWakeLock = (wakeLock: WakeLockSentinel, setWakeLock: Function) => {
        if (wakeLock) {
          wakeLock.release();
          setWakeLock(null);
        }
      };