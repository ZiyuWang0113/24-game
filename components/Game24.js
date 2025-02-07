"use client";
import { useState } from "react";


export default function Game24() {
  const defaultNumbers = [10, 8, 7, 5];
  const [numbers, setNumbers] = useState([...defaultNumbers]);
  const [selected, setSelected] = useState({ first: null, operator: null });

  const handleNumberClick = (index) => {
    if (selected.first === null) {
      setSelected({ ...selected, first: index });
    } else if (selected.operator) {
      performOperation(selected.first, index, selected.operator);
    }
  };

  const handleOperatorClick = (op) => {
    if (selected.first !== null) {
      setSelected({ ...selected, operator: op });
    }
  };

  const performOperation = (index1, index2, operation) => {
    let newNumbers = [...numbers];
    let result;

    switch (operation) {
      case "+":
        result = newNumbers[index1] + newNumbers[index2];
        break;
      case "−":
        result = newNumbers[index1] - newNumbers[index2];
        break;
      case "×":
        result = newNumbers[index1] * newNumbers[index2];
        break;
      case "÷":
        if (newNumbers[index2] !== 0) {
          result = newNumbers[index1] / newNumbers[index2];
        } else {
          return;
        }
        break;
      default:
        return;
    }

    newNumbers[index1] = result;
    newNumbers[index2] = null;
    setNumbers(newNumbers);
    setSelected({ first: null, operator: null });

    const remainingNumbers = newNumbers.filter((num) => num !== null);
    if (remainingNumbers.length === 1) {
      if (remainingNumbers[0] === 24) {
        alert("🎉 You Win! The result is 24!");
      } else {
        alert("❌ You lost! Resetting...");
      }
      resetGame();
    }
  };

  const resetGame = () => {
    setNumbers([...defaultNumbers]);
    setSelected({ first: null, operator: null });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full" style={{ backgroundColor: "#D8CFC4" }}>
      {/* Number Grid */}
      <div className="relative grid grid-cols-2 gap-12 p-12">
        {numbers.map((num, index) => (
          <div
            key={index}
            className={`w-52 h-52 flex items-center justify-center text-7xl font-bold tracking-wide 
              ${selected.first === index ? "bg-[#478058]" : num !== null ? "bg-[#8292A2]" : "bg-gray-300"}
              ${num === null ? "text-transparent" : "text-white"} 
              border-8 border-white rounded-lg shadow-xl 
              transition-all duration-300 transform 
              hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => (num !== null ? handleNumberClick(index) : null)}
            style={{ fontFamily: "'Arial Black', sans-serif" }}
          >
            {num !== null ? num : ""}
          </div>
        ))}

        {/* Center 24 Circle */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 flex items-center justify-center text-5xl font-bold bg-gray-300 text-gray-800 border-6 border-white rounded-full shadow-md"
          style={{ fontFamily: "'Arial Black', sans-serif" }}>
          24
        </div>
      </div>

      {/* Operator Buttons */}
      <div className="relative grid grid-cols-4 gap-10 p-6">
        {["＋", "−", "×", "÷"].map((op) => (
          <div
            key={op}
            className={`w-20 h-20 flex items-center justify-center text-5xl font-bold tracking-wide 
              ${selected.operator === op ? "bg-[#478058]" : "bg-[#8292A2]"}
              ${op === null ? "text-transparent" : "text-white"} 
              border-8 border-white rounded-lg shadow-xl 
              transition-all duration-300 transform 
              hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => handleOperatorClick(op)}
          >
            {op}
          </div>
          ) )}
      </div>
    </div>
  );
}
