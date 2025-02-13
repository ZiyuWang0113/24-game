"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GameGuide() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const steps = [
    "Welcome! This is a tutorial on how to play the 24 Game.",
    "You will be given 4 numbers. The goal is to use +, −, ×, ÷ to make 24.",
    "Select two numbers and an operator to perform a calculation.",
    "The result replaces the selected numbers. Repeat until only 24 remains!",
    "Try interacting with this tutorial example below!"
  ];

  const handleNextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative"
    style={{ backgroundColor: "#d8cfc4" }}>

      {/* BACK BUTTON */}
      <button
        className="absolute top-10 left-10 px-6 py-3 bg-[#a08887] text-white text-3xl font-bold rounded-lg shadow-xl
        transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
        onClick={() => router.push("/")}
      >
        ⬅
      </button>

      {/* Tutorial Step Text */}
      <div className="absolute top-10 text-center bg-white/40 p-6 rounded-xl shadow-lg">
        <p className="text-3xl font-bold" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
          {steps[step]}
        </p>
      </div>

      {/* Example Game Setup */}
      <div className="relative grid grid-cols-2 gap-12 p-12">
        <div className="w-52 h-52 flex items-center justify-center text-7xl font-bold bg-[#8292A2] text-white border-8 border-white rounded-lg shadow-xl">4</div>
        <div className="w-52 h-52 flex items-center justify-center text-7xl font-bold bg-[#8292A2] text-white border-8 border-white rounded-lg shadow-xl">8</div>
        <div className="w-52 h-52 flex items-center justify-center text-7xl font-bold bg-[#8292A2] text-white border-8 border-white rounded-lg shadow-xl">3</div>
        <div className="w-52 h-52 flex items-center justify-center text-7xl font-bold bg-[#8292A2] text-white border-8 border-white rounded-lg shadow-xl">1</div>
      </div>

      {/* Operators */}
      <div className="grid grid-cols-4 gap-10">
        {["+", "−", "×", "÷"].map((op) => (
          <div key={op} className="w-20 h-20 flex items-center justify-center text-5xl font-bold bg-[#8292A2] text-white border-8 border-white rounded-lg shadow-xl">{op}</div>
        ))}
      </div>

      {/* Next Step Button */}
      <AnimatePresence>
        {step < steps.length - 1 && (
          <motion.button
            className="mt-10 px-8 py-4 bg-[#a08887] text-white text-3xl font-bold rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
            onClick={handleNextStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            Next →
          </motion.button>
        )}
      </AnimatePresence>

      {/* Play Button */}
      {step === steps.length - 1 && (
        <motion.button
          className="mt-10 px-8 py-4 bg-[#a08887] text-white text-3xl font-bold rounded-lg shadow-xl transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]"
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
          onClick={() => router.push("/mode-selection")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          Play Game 🎮
        </motion.button>
      )}
    </div>
  );
}
