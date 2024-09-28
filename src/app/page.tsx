import { AudioContextProvider } from "@/components/AudioContextProvider"
import { Metronome } from "@/components/Metronome";
import { Metronome2 } from "@/components/Metronome2";
import { VolumeControl } from "@/components/VolumeControl";
import { ChangeSound } from "@/components/ChangeSound";
import { useEffect } from "react";

export default function Home() {


  return (
    <AudioContextProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-5 text-white">
        {/* <h1 className="text-2xl font-bold mb-8 sm:text-4xl">Ching-Chap Metronome</h1> */}
        <Metronome/>
        <Metronome2 />
        <VolumeControl />
        <ChangeSound/>
      </main>
    </AudioContextProvider>
  );
}
