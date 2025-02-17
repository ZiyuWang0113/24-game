"use client";
import { useState, useEffect } from "react";
import * as math from "mathjs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GameGuide() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [numbers, setNumbers] = useState([3, 4, 6, 10]);
  const [initialNumbers, setInitialNumbers] = useState([3, 4, 6, 10]); // Store original set
  const [selected, setSelected] = useState({ first: null, operator: null });
  const [history, setHistory] = useState([]);
  const [background, setBackground] = useState("#d8cfc4");
  const [overlay, setOverlay] = useState([]);
  const [hoveredButton, setHoveredButton] = useState(null);

  const [nextLock, setNextLock] = useState(false);
  const [circleColor, setCircleColor] = useState("gray-300");                   // Default 24 circle color
  const [numberHighlight, setNumberHighlight] = useState(null);                 // Track first number selection
  const [operatorHighlight, setOperatorHighlight] = useState(null);             // Track operator selection
  const [secondNumberHighlight, setSecondNumberHighlight] = useState(null);     // Track second number selection

  const [hasFailed, setHasFailed] = useState(false);
  const [showCursor, setShowCursor] = useState(false); // Whether to show fake cursor
  const [cursorPosition, setCursorPosition] = useState({ x: "50%", y: "50%" }); // Initial position


  const steps = [
    "Welcome! This is a guide on how to play.",
    "There will be 4 numbers. The goal is to use +, −, ×, ÷ to make 24.",
    "Select one number, one operator, and another number in a row to perform one calculation.",
    "Let's try to play around. Now click 10, −, 4, to get a 6.",
    "The result replaces the selected numbers. Repeat until only 24 remains!",
    "Now click the UNDO button to undo the previous calculation.",
    "Now click 6, then click −, then click 4, to get 2.",
    "Now click 10, then click −, then click 2, to get 8.",
    "Now click 8, then click ×, then click 3, to get 24.",
    "You got it! Turning green means you are correct. It's time to play!"
  ];
  
  // next lock
  const handleNextStep = () => {
    if (!nextLock) {  // Only allow clicking if animations are done
      setStep(step + 1);
    }
  };

  useEffect(() => {
    setNumbers(numbers.map(num => math.fraction(num)));
    setOverlay(false);
  }, []);
  
  /* STEP EFFECT 0-index*/
  // step 1
  useEffect(() => {
    if (step === 1) {
      setNextLock(true);

      setTimeout(() => {
        setNumberHighlight("all");

        setTimeout(() => {
          setNumberHighlight(null);

          setCircleColor("#F77E66");
  
            setTimeout(() => {
              setCircleColor("#c0c0c0");
              setNextLock(false);
            }, 1000);
  
        }, 1000);

      }, 1000);
    }
  }, [step]);
  
  // step 2
  useEffect(() => {
    if (step === 2) {
      setNextLock(true);
      setTimeout(() => {
        setNumberHighlight(0);
  
        setTimeout(() => {
          setOperatorHighlight("+");
  
          setTimeout(() => {
            setSecondNumberHighlight(1);
  
            setTimeout(() => {
              setNumberHighlight(null);
              setOperatorHighlight(null);
              setSecondNumberHighlight(null);
              setNextLock(false);
            }, 2000);
  
          }, 1000);
  
        }, 1000);
  
      }, 1000);
    }
  }, [step]);

  // step 3
  useEffect(() => {
    if (step === 3) {
      setTimeout(() => setShowCursor(true), 1000);
      setNextLock(false);
      setCursorPosition({ x: "50%", y: "50%" });

      // Move cursor to "10" and highlight it
      setTimeout(() => {
        setCursorPosition({ x: "56%", y: "50%" });
        setNumberHighlight(3);  // ✅ Highlight "10"
      }, 2000);

      // Move cursor to "-" and highlight it
      setTimeout(() => {
        setCursorPosition({ x: "44%", y: "72%" });
        setOperatorHighlight("−");  // ✅ Highlight "-"
        setNumberHighlight(null);  // ❌ Remove highlight from "10"
      }, 4000);

      // Move cursor to "4" and highlight it
      setTimeout(() => {
        setCursorPosition({ x: "56%", y: "25%" });
        setSecondNumberHighlight(1);  // ✅ Highlight "4"
        setOperatorHighlight(null);  // ❌ Remove highlight from "-"
      }, 6000);
    
      // Cursor Gone, remove all highlights
      setTimeout(() => {
        setShowCursor(false);
        setNumberHighlight(null);
        setOperatorHighlight(null);
        setSecondNumberHighlight(null);
      }, 8000);
    }
  }, [step]);


  // step 5
  useEffect(() => {
    if (step === 5) {
      setTimeout(() => {
        setOperatorHighlight("↺");
        setTimeout(() => setOperatorHighlight(null), 2000);
      }, 1000);
    }
  }, [step]);

  
  const handleNumberClick = (index) => {
    if (nextLock) return;     // Prevent clicking only if locked
    // console.log(`Clicked number: ${index}, Current selection:`, selected); // Debugging
  
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
    if (nextLock) return;     // Prevent clicking only if locked
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

    switch (operation) {
      case "+":
        result = math.add(newNumbers[index1], newNumbers[index2]);
        break;
      case "−":
        result = math.subtract(newNumbers[index1], newNumbers[index2]);
        break;
      case "×":
        result = math.multiply(newNumbers[index1], newNumbers[index2]);
        break;
      case "÷":
        // 0 DIVISION
        if (math.equal(newNumbers[index2], math.fraction(0))) {
          const alertBox = document.createElement('div');
          alertBox.textContent = "0 division";
          alertBox.style.position = 'fixed';
          alertBox.style.top = '50%';
          alertBox.style.left = '50%';
          alertBox.style.transform = 'translate(-50%, -50%)';
          alertBox.style.background = 'rgba(0, 0, 0, 0.75)';
          alertBox.style.color = 'white';
          alertBox.style.padding = '20px';
          alertBox.style.borderRadius = '10px';
          alertBox.style.fontSize = '30px';
          alertBox.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
          alertBox.style.fontWeight = 'bold';
          alertBox.style.zIndex = '1000';
          document.body.appendChild(alertBox);
          setBackground("#c09d9b");
          setTimeout(() => {
            document.body.removeChild(alertBox);
            setBackground("#d8cfc4");
          }, 750);
          return;
        }

        result = math.divide(newNumbers[index1], newNumbers[index2]);
        break;
      default:
        return;
      }

    setHistory([...history, [...numbers]]);
    newNumbers[index1] = result;
    newNumbers[index2] = null;
    setNumbers(newNumbers);
    setSelected({ first: null, operator: null });

    // result check
    const remainingNumbers = newNumbers.filter((num) => num !== null);
    if (remainingNumbers.length === 1) {
      let finalValue = remainingNumbers[0];
      const value = finalValue.s * (finalValue.n / finalValue.d);
      /* FINAL ANSWER */
      setBackground(value === 24n ? "#678f74" : "#c09d9b");
      setTimeout(() => {
        setOverlay(true);
        if (value === 24n) { // WIN
          setHistory([]);
          setStep(9);
        } else {             // LOSE
          setHistory([]);
          setNumbers(initialNumbers.map(num => math.fraction(num)));
        }
        setTimeout(() => {
          setOverlay(false);
          setBackground("#d8cfc4");
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


  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative"
    style={{ backgroundColor: background }}>
      <style jsx global>{`
        * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}
      </style>

      {/* Tutorial Step Text */}
      <div className="absolute top-5 text-center bg-white/40 p-6 rounded-xl shadow-lg">
        <p className="text-4xl font-bold" style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
          {steps[step]}
        </p>
      </div>

      {/* Back Button */}
      <button
        className={`absolute top-10 left-10 px-6 py-3 bg-[#a08887] text-white text-xl font-bold rounded-lg shadow-xl
        transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]`}
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif", zIndex: 50 }}
        onClick={() => router.back()}
      >
        ← Back
      </button>


      {/* NUMS */}
      <div className="relative grid grid-cols-2 gap-12 p-12">
        {numbers.map((num, index) => (
          <div key={index} className={`w-52 h-52 flex items-center justify-center text-7xl font-bold tracking-wide 
            ${selected.first === index ? "bg-[#889f8b]" : num !== null ? "bg-[#8292A2]" : "bg-gray-300"}
            ${num === null ? "text-transparent" : "text-white"} 
            border-8 border-white rounded-lg shadow-xl 
            transition-all duration-300 transform hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => (num !== null ? handleNumberClick(index) : null)}
            style={{
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              backgroundColor: selected.first === index ? "#678f74" : 
                               numberHighlight === index ? "#F77E66" : 
                               numberHighlight === "all" ? "#F77E66" : 
                               secondNumberHighlight === index ? "#6699FF" : "#8292A2"
            }}>
            {num ? (
              math.equal(num.d, 1n) ? 
              (<span>{math.number(num)}</span>) : 
              (<div className="flex flex-row items-center">
                  {num.s === -1n && <span className="text-6xl font-bold mr-1">-</span>}
                  <div className="flex flex-col items-center">
                    <span>{num.n}</span>
                    <div className="w-full border-t-4 border-white my-1"></div>
                    <span>{num.d}</span>
                  </div>
              </div>)
            ) : ""}
          </div>
        ))}

        <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32
        flex items-center justify-center text-4xl bg-[#e0e0e0] text-gray-800 
        border-5 border-white rounded-full shadow-md`}
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif", backgroundColor: circleColor}}>
          24
        </div>
      </div>
      

      {/* OPERATOR + UNDO */}
      <div className="relative grid grid-cols-5 gap-10 p-6">
        {["+", "−", "×", "÷", "↺"].map((op) => (
          <div
            key={op}
            className={`w-20 h-20 flex items-center justify-center text-5xl font-bold tracking-wide 
              ${selected.operator === op ? "bg-[#889f8b]" : "bg-[#8292A2]"} text-white 
              border-4 border-white rounded-lg shadow-xl transition-all duration-300 transform
              hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => (op === "↺" ? handleUndo() : handleOperatorClick(op))}
            style={{ backgroundColor: selected.operator === op ? "#678f74" :
                    operatorHighlight === op ? "#ff99cc" : "#8292A2" }}
          >
            {op === "↺" ? "↺" : op}
          </div>
        ))}
      </div>
      
      {/* NOTE Button */}
      <div className="absolute top-24 right-10 flex flex-col gap-20">
        <button
          className={`w-20 h-20 flex items-center justify-center font-bold bg-[#8292A2] text-white
            border-4 border-white rounded-lg shadow-xl transition-all duration-300 transform hover:scale-125 
                hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
          onMouseEnter={() => setHoveredButton("Note")}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <span className={hoveredButton === "Note" ? "text-[12pt]" : "text-[28pt]"}>
            {hoveredButton === "Note" ? "Note" : "📝"}
          </span>
        </button>
        {hoveredButton === "Note" && (
            <div className={`absolute left-[-180px] top-[30px] left-1/2 transform -translate-x-1/2 w-80 p-3 text-2xl bg-gray-800
            bg-opacity-60 backdrop-blur-md text-white text-center rounded-md shadow-lg`}
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
              🖱️ Click again to unselect.<br />
              ➗ Division by 0 is illegal.<br />
              🧮 Fraction is legal.<br />
              💡 Try it!
            </div>
          )}
      </div>
      
      {/* OVERLAY */}
      {overlay && (
        <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xl
          bg-white/20 transition-opacity duration-500 opacity-100`}
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}>
        </div>
      )}

      {/* Next Step Button */}
      {step < steps.length - 1 && (
        <button
          className={`mt-10 px-8 py-4 bg-[#a08887] text-white text-3xl font-bold rounded-lg shadow-xl
            transition-all duration-300 transform 
            ${nextLock ? "opacity-50 cursor-not-allowed" : "hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer"}`}
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
          onClick={handleNextStep}
          disabled={nextLock} // Prevent clicking
        >
          Next →
        </button>
      )}

      {/* Cursor */}
      {showCursor && (
        <div
          className="absolute pointer-events-none"
          style={{
            position: "absolute",
            width: "40px",
            height: "40px",
            top: cursorPosition.y,
            left: cursorPosition.x,
            transition: "top 1s ease, left 1s ease", // Smooth movement
            transform: "translate(-5px, -5px)", // Offset for realism
            zIndex: 1000, // Ensure it stays on top
          }}
        >
          {/* Cursor SVG - Black Pointer */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 2L5 17L9 13L12 20L14 19L11 12L16 11L3 2Z" />
          </svg>
        </div>
      )}

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
