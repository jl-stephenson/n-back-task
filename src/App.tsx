import { useEffect, useRef, useState } from "react";

const LETTERS = ["A", "B", "A", "D", "E", "F", "E"];

type Trial = {
  id: number;
  timeStarted: number;
  correctCount: number;
  missCount: number;
};

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const currentLetterRef = useRef("");
  const isMatchRef = useRef(false);
  const [trial, setTrial] = useState<Trial>({
    id: Date.now(),
    timeStarted: Date.now(),
    correctCount: 0,
    missCount: 0,
  });

  useEffect(() => {
    if (index >= LETTERS.length) return;

    currentLetterRef.current = LETTERS[index];

    isMatchRef.current = index >= 2 && currentLetterRef.current === LETTERS[index - 2];

    setDisplayLetter(LETTERS[index]);
    const hideTimeout = setTimeout(() => {
      setDisplayLetter("");
    }, 500);

    const nextLetterTimeout = setTimeout(() => {
      setIndex((index) => index + 1);
    }, 3000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextLetterTimeout);
    };
  }, [index]);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "m" && isMatchRef.current) {
      setTrial((prevTrial) => {
        const newCount = prevTrial.correctCount + 1;
        return {
          ...prevTrial,
          correctCount: newCount,
        };
      });
    }
  
      if (event.key === "m" && !isMatchRef.current) {
      setTrial((prevTrial) => {
        const newCount = prevTrial.missCount + 1;
        return {
          ...prevTrial,
          missCount: newCount,
        };
      });
    }
  
      console.log(trial);
    }
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      <div>
        <h1>{displayLetter}</h1>
        {index >= LETTERS.length && (
          <div>
            <h2>Results</h2>
            <p>Total Correct: {trial.correctCount}</p>
            <p>Total Misses: {trial.missCount}</p>
          </div>
        )}
      </div>
    </>
  );
}
