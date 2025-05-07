import { useEffect, useRef, useState } from "react";

const LETTERS = ["A", "B", "A", "D", "E", "F", "E"];

type Trial = {
  id: number;
  timeStarted: number;
  correctCount: number;
  falseAlarmCount: number;
  missCount: number;
};

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const [isKeydown, setIsKeydown] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [trial, setTrial] = useState<Trial>({
    id: Date.now(),
    timeStarted: Date.now(),
    correctCount: 0,
    falseAlarmCount: 0,
    missCount: 0,
  });

  const isMatchRef = useRef(false);
  const currentLetterRef = useRef("");

  useEffect(() => {
    if (isEnd) return;
    if (!isKeydown && isMatchRef.current) {
      setTrial((prevTrial) => {
        const newCount = prevTrial.missCount + 1;
        return {
          ...prevTrial,
          missCount: newCount,
        };
      });
    }

    setIsKeydown(false);

    if (
      index >= LETTERS.length ||
      trial.falseAlarmCount + trial.missCount >= 2
    ) {
      setIsEnd(true);
      return;
    }

    currentLetterRef.current = LETTERS[index];

    isMatchRef.current =
      index >= 2 && currentLetterRef.current === LETTERS[index - 2];

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
  }, [index, isKeydown, trial.falseAlarmCount, trial.missCount, isEnd]);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (isEnd) return;
      setIsKeydown(true);
      if (event.key.toLowerCase() === "m") {
        setTrial((prevTrial) => {
          const field = isMatchRef.current ? "correctCount" : "falseAlarmCount";
          const newCount = prevTrial[field] + 1;
          return {
            ...prevTrial,
            [field]: newCount,
          };
        });
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      <div>
        <h1>{displayLetter}</h1>
        {isEnd && (
          <div>
            <h2>Results</h2>
            <p>Total Correct: {trial.correctCount}</p>
            <p>Total False Alarms: {trial.falseAlarmCount}</p>
            <p>Total Misses: {trial.missCount}</p>
          </div>
        )}
      </div>
    </>
  );
}
