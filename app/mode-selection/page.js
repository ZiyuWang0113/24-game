"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ModeSelection() {
  const router = useRouter();
  const [hoveredMode, setHoveredMode] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative"
    style={{ backgroundColor: "#d8cfc4" }}>
      {/* Back Button */}
      <button
        className="absolute top-10 left-10 px-6 py-3 bg-[#a08887] text-white text-3xl font-bold rounded-lg shadow-xl
        transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        onClick={() => router.back()}
      >
        ← Back
      </button>

      {/* Mode Buttons */}
      <div className="flex gap-10">
        {/* Competition Mode */}
        <div className="relative">
          <button
            className="px-8 py-4 bg-[#a08887] text-white text-4xl font-bold rounded-lg shadow-xl
            transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
            onMouseEnter={() => setHoveredMode("competition")}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => router.push("/game24?mode=competition")}
          >
            Competition Mode
          </button>
          {hoveredMode === "competition" && (
            <div className="absolute top-[-180px] left-1/2 transform -translate-x-1/2 w-80 p-4 text-2xl bg-gray-800
            bg-opacity-60 backdrop-blur-md text-white text-center rounded-md shadow-lg"
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
              ⏳ Timer<br />
              🥇 Get more points<br />
              💡 No hint available<br />
              💯 No solution available
            </div>
          )}
        </div>

        {/* Practice Mode */}
        <div className="relative">
          <button
            className="px-8 py-4 bg-[#a08887] text-white text-4xl font-bold rounded-lg shadow-xl
            transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
            onMouseEnter={() => setHoveredMode("practice")}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => router.push("/game24?mode=practice")}
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
          >
            Practice Mode
          </button>
          {hoveredMode === "practice" && (
            <div className="absolute top-[-180px] left-1/2 transform -translate-x-1/2 w-80 p-4 text-2xl bg-gray-800
            bg-opacity-60 backdrop-blur-md text-white text-center rounded-md shadow-lg"
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
              ⏳ No Timer<br />
              📚 Practice<br />
              💡 Hint available<br />
              💯 Solution available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
