import { AudioContextProvider } from "@/components/AudioContextProvider"
import { Metronome } from "@/components/Metronome";
import { VolumeControl } from "@/components/VolumeControl";
import { ChangeSound } from "@/components/ChangeSound";

export default function Home() {
  return (
    <AudioContextProvider>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-500 to-purple-600 p-5 text-white">
        {/* <h1 className="text-2xl font-bold mb-8 sm:text-4xl">Ching-Chap Metronome</h1> */}
        <Metronome />
        <VolumeControl />
        <ChangeSound/>
      </main>
    </AudioContextProvider>
  );
}
