"use client";
import { useState, useEffect } from "react";
import * as math from "mathjs";
import { useSearchParams } from "next/navigation";

export default function Game24() {
  const searchParams = useSearchParams();
  const isCompetition = searchParams.get("mode") === "competition";

  const [numbers, setNumbers] = useState([]);
  const [initialNumbers, setInitialNumbers] = useState([]); // Store original set
  const [selected, setSelected] = useState({ first: null, operator: null });
  const [history, setHistory] = useState([]);
  const [background, setBackground] = useState("#d8cfc4");
  const [overlay, setOverlay] = useState(isCompetition);
  const [countdown, setCountdown] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [isJudging, setIsJudging] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Function to fetch new numbers from backend
  const fetchNumbers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_numbers");
      const data = await response.json();
      setNumbers(data.map(num => math.fraction(num)));
      setInitialNumbers(data.map(num => math.fraction(num)));
      setHistory([]); // Clear history when new numbers are fetched
    } catch (error) {
      console.error("Error fetching numbers:", error);
    }
  };
  // Fetch numbers and mode
  useEffect(() => {
    fetchNumbers();
  }, []);
  
  // Timer
  useEffect(() => {
    if (isCompetition && hasStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isCompetition && hasStarted && timeLeft === 0) {
      setGameOver(true);
      setOverlay(true);
    }
  }, [timeLeft, isCompetition, hasStarted]);

  const handleStartCompetition = () => {
    let count = 3;
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        setCountdown(null);
        setOverlay(false);
        setHasStarted(true);
        // start the countdown, CHANGE TIME HERE
        setTimeLeft(120);
      }
    }, 1000);
  };

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
      setIsJudging(true);
      setBackground(value === 24n ? "#678f74" : "#c09d9b");
      setTimeout(() => {
        setOverlay(true);
        if (value === 24n) { // WIN
          if (isCompetition) setScore(score + 1);
          fetchNumbers(); 
          setHistory([]);
        } else {             // LOSE
          setHistory([]); 
          setNumbers([...initialNumbers]); // Reset to the original
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

      {/* NUMS */}
      <div className="relative grid grid-cols-2 gap-12 p-12">
        {numbers.map((num, index) => (
          <div key={index} className={`w-52 h-52 flex items-center justify-center text-7xl font-bold tracking-wide 
            ${selected.first === index ? "bg-[#889f8b]" : num !== null ? "bg-[#8292A2]" : "bg-gray-300"}
            ${num === null ? "text-transparent" : "text-white"} 
            border-8 border-white rounded-lg shadow-xl 
            transition-all duration-300 transform 
            hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] hover:-translate-y-2 cursor-pointer`}
            onClick={() => (num !== null ? handleNumberClick(index) : null)}
            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>

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
        flex items-center justify-center text-4xl bg-gray-300 text-gray-800 
        border-5 border-white rounded-full shadow-md`}
        style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
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
        <div className={`w-20 h-20 flex items-center justify-center text-5xl font-bold tracking-wide bg-[#a08887] 
        text-white border-8 border-white rounded-lg shadow-xl transition-all duration-300 
        transform hover:scale-125 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)] 
        hover:-translate-y-2 cursor-pointer`} onClick={handleUndo}>
          ↺
        </div>
      </div>
      {isCompetition && <div className="absolute top-5 text-8xl font-bold"
                         style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>{timeLeft}</div>}
      {isCompetition && <div className="absolute top-5 right-5 text-4xl font-bold"
                         style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>Score: {score}</div>}
      {/* OVERLAY */}
      {overlay && (
        <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-xl
          bg-white/20 transition-opacity duration-500 opacity-100`}
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
          {countdown !== null ? (<span className="text-8xl font-bold">{countdown}</span>
          ) : (!isJudging && !gameOver &&
              <button className={`p-8 bg-[#a08887] text-white text-6xl rounded-lg
              transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]`}
              onClick={handleStartCompetition}>Ready</button>)}
        </div>
      )}

      {/* GAME OVER */}
      {gameOver && (
        <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center backdrop-blur-xl
          bg-white/20 transition-opacity duration-500 opacity-100`}
          style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
          <span className="text-6xl font-bold mb-4">Final Score: {score}</span>
          <button className={`mt-4 p-8 bg-[#a08887] text-white text-6xl rounded-lg
            transition-transform duration-300 transform hover:scale-110 hover:shadow-[0px_0px_30px_rgba(255,255,255,0.8)]`}
            onClick={() => window.location.href = "/mode-selection"}>
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
