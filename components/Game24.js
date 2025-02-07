"use client";
import { useState } from "react";

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyFraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
}

export default function Game24() {
  const defaultNumbers = [10, 8, 7, 5];
  const [numbers, setNumbers] = useState([...defaultNumbers]);
  const [selected, setSelected] = useState({ first: null, operator: null });
  const [history, setHistory] = useState([]);
  const [background, setBackground] = useState("#D8CFC4");
  const [overlay, setOverlay] = useState(false);

  const handleNumberClick = (index) => {
    if (selected.first === index) {
      setSelected({ first: null, operator: null });
      return;
    }
    if (selected.first === null) {
      setSelected({ ...selected, first: index });
    } else if (selected.operator) {
      performOperation(selected.first, index, selected.operator);
    }
  };

  const handleOperatorClick = (op) => {
    if (selected.operator === op) {
      setSelected({ ...selected, operator: null });
      return;
    }
    if (selected.first !== null) {
      setSelected({ ...selected, operator: op });
    }
  };

  const performOperation = (index1, index2, operation) => {
    let newNumbers = [...numbers];
    let result;
    let numerator, denominator;

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
          numerator = newNumbers[index1];
          denominator = newNumbers[index2];
          [numerator, denominator] = simplifyFraction(numerator, denominator);
          result = `${numerator}/${denominator}`;
        } else {
          return;
        }
        break;
      default:
        return;
    }

    setHistory([...history, [...numbers]]);
    newNumbers[index1] = result;
    newNumbers[index2] = null;
    setNumbers(newNumbers);
    setSelected({ first: null, operator: null });

    // RESULT CHECKING
    const remainingNumbers = newNumbers.filter((num) => num !== null);
    if (remainingNumbers.length === 1) {
      let finalValue = remainingNumbers[0];
      if (typeof finalValue === "string" && finalValue.includes("/")) {
        const [num, den] = finalValue.split("/").map(Number);
        if (num % den === 0) finalValue = num / den;
      }
      setBackground(finalValue === 24 ? "#678f74" : "#c09d9b");
      setTimeout(() => {
        setOverlay(true);
        if (finalValue !== 24) resetGame();
        setTimeout(() => {
        setOverlay(false);
        setBackground("#D8CFC4");
        }, 500);
      }, 1000);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      setNumbers(history[history.length - 1]);
      setHistory(history.slice(0, -1));
      setSelected({ first: null, operator: null });
    }
  };

  const resetGame = () => {
    setNumbers([...defaultNumbers]);
    setSelected({ first: null, operator: null });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative"
    style={{ backgroundColor: background }}>
      {/* NUMS */}
      <div className="relative grid grid-cols-2 gap-12 p-12">
        {numbers.map((num, index) => (
          <div
            key={index}
            className={`w-52 h-52 flex items-center justify-center text-7xl font-bold tracking-wide 
              ${selected.first === index ? "bg-[#889f8b]" : num !== null ? "bg-[#8292A2]" : "bg-gray-300"}
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
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32
        flex items-center justify-center text-4xl bg-gray-300 text-gray-800 
        border-5 border-white rounded-full shadow-md"
        style={{ fontFamily: "'Arial Black', sans-serif" }}>
          24
        </div>
      </div>
      
      {/* OPERATOR + UNDO */}
      <div className="relative grid grid-cols-5 gap-10 p-6">
        {["+", "−", "×", "÷"].map((op) => (
          <div
            key={op}
            className={`w-20 h-20 flex items-center justify-center text-5xl font-bold tracking-wide 
              ${selected.operator === op ? "bg-[#889f8b]" : "bg-[#8292A2]"} text-white 
              border-8 border-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-125 
              hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => handleOperatorClick(op)}
          >
            {op}
          </div>
        ))}
        <div className="w-20 h-20 flex items-center justify-center text-5xl font-bold tracking-wide bg-[#a08887] 
        text-white border-8 border-white rounded-lg shadow-xl transition-all duration-300 
        transform hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] 
        hover:-translate-y-2 cursor-pointer" onClick={handleUndo}>
          ↺
        </div>
      </div>

      {overlay && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xl bg-white/30 transition-opacity duration-500 opacity-100"></div>
      )}
    </div>
  );
}
