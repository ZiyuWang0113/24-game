"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full pt-16 relative"
    style={{ backgroundColor: "#d8cfc4" }}>
      
      {/* Title */}
      <h1 className="text-9xl font-extrabold mb-10 text-gray-800 tracking-wider"
        style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.1em" }}>
        <span style={{ fontFamily: "'Lobster', cursive", fontSize: "14rem", color: "#4a4a4a" }}>
          24
        </span>
      </h1>
      
      {/* Wikipedia Info Box */}
      <div className="w-4/4 md:w-2/2 p-6">
        <p className="text-center"
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif", fontSize: "20px" }}>
          The <b>24 Game</b> is a mathematical card game to arrange four given numbers<br />
          using addition, subtraction, multiplication, and division to total 24.<br />
          Read more on <a href="https://en.wikipedia.org/wiki/24_(puzzle)" target="_blank" className="text-[#a08887] font-bold hover:underline">Wikipedia</a>.
        </p>
      </div>
      
      {/* Play Button */}
      <button className="mt-10 px-8 py-4 bg-[#a08887] text-white text-2xl font-bold rounded-lg shadow-xl
        transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
        onClick={() => router.push("/mode-selection")}
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
      >
        Play Game
      </button>
    </div>
  );
}
