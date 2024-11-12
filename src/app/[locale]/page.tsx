import {Metronome} from "@/components/Metronome"
import { VolumeControl } from "@/components/VolumeControl";
import { ChangeSound } from "@/components/ChangeSound";
import '../../styles/globals.css'

export default function Home() {

  return (

        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-red-900 p-10 pt-20 text-white">
          {/* Main Metronome Component */}
          <Metronome/>
          <VolumeControl />
          <ChangeSound />
        </main>  
  );
}
