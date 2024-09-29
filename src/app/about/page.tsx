import { Music, Square, Lock } from "lucide-react";

export default function About() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-red-900 p-5 text-white">
      {/* Title */}
      <h1 className="text-xl font-bold mb-8 sm:text-4xl mt-12 sm:mt-4">About Ching-Chap Metronome</h1>

      <div className="max-w-[80vh]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Play Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-500 shadow-lg shadow-gray-700 rounded-full flex items-center justify-center mb-4">
              <Music size={40} />
            </div>
            <p className="text-xl font-semibold">Play Button</p>
            <p className="text-center text-sm">
              Tap this button twice to start the metronome. The interval you tap will determine the metronome&apos;s rhythm.
            </p>
          </div>

          {/* Stop Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-400 shadow-lg shadow-red-700 rounded-full flex items-center justify-center mb-4">
              <Square size={40} />
            </div>
            <p className="text-xl font-semibold">Stop Button</p>
            <p className="text-center text-sm">
              Press this button to stop the metronome after the current cycle finishes.
            </p>
          </div>

          {/* Lock Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg shadow-blue-700">
              <Lock size={40} />
            </div>
            <p className="text-xl font-semibold">Manual Mode Button</p>
            <p className="text-center text-sm">
              This button toggles manual mode. When active, you can manually play the &quot;Ching&quot; and &quot;Chap&quot; sounds.
            </p>
          </div>

          {/* BPM Button (Centered) */}
          <div className="flex flex-col items-center col-span-1 sm:col-span-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-blue-600 to-red-400 shadow-lg shadow-gray-700">
              BPM
            </div>
            <p className="text-xl font-semibold">Start From BPM Button</p>
            <p className="text-center text-sm">
              This button starts the metronome according to the input BPM.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8">
        <a
          href="https://github.com/konglol524"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-white underline hover:text-gray-300"
        >
          Made by Kong
        </a>
      </footer>
    </main>
  );
}