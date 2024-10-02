import { AudioContextProvider } from "@/components/AudioContextProvider"
import { Metronome } from "@/components/Metronome";
import { Metronome3 } from "@/components/Metronome3";
import { VolumeControl } from "@/components/VolumeControl";
import { ChangeSound } from "@/components/ChangeSound";
import { useEffect } from "react";

export default function Home() {


  return (
<AudioContextProvider>
  <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-red-900 p-5 text-white">
    {/* Main Metronome Component */}
    <Metronome3 />
    <VolumeControl />
    <ChangeSound />
  </main>
</AudioContextProvider>
  );
}
