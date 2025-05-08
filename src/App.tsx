import { useEffect, useMemo, useReducer, useRef, useState } from "react";

const LETTERS = ["A", "B", "A", "D", "E", "F", "E"];
const MAX_ERRORS = 2;

type Trial = {
  id: number;
  timestamp: number;
  correctCount: number;
  falseAlarmCount: number;
  missCount: number;
};

type Action =
  | { type: "started" }
  | { type: "false_alarm" }
  | { type: "identified_correct" }
  | { type: "missed" };

const initialTrial: Trial = {
  id: 0,
  timestamp: 0,
  correctCount: 0,
  falseAlarmCount: 0,
  missCount: 0,
};

function trialReducer(trial: Trial, action: Action) {
  switch (action.type) {
    case "started": {
      return {
        id: Date.now(),
        timestamp: Date.now(),
        correctCount: 0,
        falseAlarmCount: 0,
        missCount: 0,
      };
    }
    case "identified_correct": {
      return {
        ...trial,
        correctCount: trial.correctCount + 1,
      };
    }
    case "false_alarm": {
      return {
        ...trial,
        falseAlarmCount: trial.falseAlarmCount + 1,
      };
    }
    case "missed": {
      return {
        ...trial,
        missCount: trial.missCount + 1,
      };
    }
    default: {
      return trial;
    }
  }
}

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const isKeydownRef = useRef(false);
  const [trial, dispatch] = useReducer(trialReducer, initialTrial);

  const isEnd =
    trial.falseAlarmCount + trial.missCount >= MAX_ERRORS ||
    index >= LETTERS.length;

  const isMatch = useMemo(
    () => index >= 2 && LETTERS[index] === LETTERS[index - 2],
    [index]
  );

  useEffect(() => {
    dispatch({ type: "started" });
  }, []);

  useEffect(() => {
    if (isEnd) return;

    setDisplayLetter(LETTERS[index]);

    const hideTimeout = setTimeout(() => {
      setDisplayLetter("");
    }, 500);

    const nextLetterTimeout = setTimeout(() => {
      if (isMatch && !isKeydownRef.current) {
        dispatch({ type: "missed" });
      }
      isKeydownRef.current = false;
      setIndex((index) => index + 1);
    }, 3000);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextLetterTimeout);
    };
  }, [index, isEnd, isMatch]);

  useEffect(() => {
    if (isEnd) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "m") return;

      isKeydownRef.current = true;

      dispatch({ type: isMatch ? "identified_correct" : "false_alarm" });
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, isEnd, isMatch]);

  return (
    <>
      <div>
        {!isEnd && <h1>{displayLetter}</h1>}
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
