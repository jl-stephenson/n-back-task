import { useEffect, useReducer, useRef, useState } from "react";

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
{type: "started"} |
{type: "false_alarm"} |
{type: "identified_correct"} |
{type: "missed"};

const initialTrial = {
  id: 0,
  timestamp: 0,
  correctCount: 0,
  falseAlarmCount: 0,
  missCount: 0,
};

function trialReducer(state: Trial, action: Action) {
  switch (action.type) {
    case "started": {
      return {
        ...state,
        id: Date.now(),
        timestamp: Date.now(),
      };
    }
    case "identified_correct": {
      return {
        ...state,
        correctCount: state.correctCount + 1,
      };
    }
    case "false_alarm": {
      return {
        ...state,
        falseAlarmCount: state.falseAlarmCount + 1,
      };
    }
    case "missed": {
      return {
        ...state,
        missCount: state.missCount + 1,
      };
    }
    default: {
      return state;
    }
  }
}

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const isKeydownRef = useRef(false);
  const [state, dispatch] = useReducer(trialReducer, initialTrial);

  const isEnd =
    state.falseAlarmCount + state.missCount >= MAX_ERRORS ||
    index >= LETTERS.length;

  useEffect(() => {
    if (isEnd) return;

    const isMatch = index >= 2 && LETTERS[index] === LETTERS[index - 2];

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
  }, [index, isEnd]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "m" || isEnd) return;

      const isMatch = index >= 2 && LETTERS[index] === LETTERS[index - 2];
      isKeydownRef.current = true;

      dispatch({ type: isMatch ? "identified_correct" : "false_alarm" });
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, isEnd]);



  return (
    <>
      <div>
        {!isEnd && <h1>{displayLetter}</h1>}
        {isEnd && (
          <div>
            <h2>Results</h2>
            <p>Total Correct: {state.correctCount}</p>
            <p>Total False Alarms: {state.falseAlarmCount}</p>
            <p>Total Misses: {state.missCount}</p>
          </div>
        )}
      </div>
    </>
  );
}
