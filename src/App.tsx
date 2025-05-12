import { useEffect, useMemo, useReducer, useRef, useState } from "react";

const LETTERS = [
  "A",
  "S",
  "A",
  "D",
  "N",
  "F",
  "N",
  "N",
  "Q",
  "B",
  "Q",
  "Z",
  "L",
  "K",
  "L",
];
const MAX_ERRORS = 2;

type Trial = {
  id: number;
  username: string;
  timestamp: number;
  correctCount: number;
  falseAlarmCount: number;
  missCount: number;
};

type Action =
  | { type: "started"; name: string }
  | { type: "false_alarm" }
  | { type: "identified_correct" }
  | { type: "missed" };

type LandingScreenProps = {
  onStart: (name: string) => void;
};

const initialTrial: Trial = {
  id: 0,
  username: "",
  timestamp: 0,
  correctCount: 0,
  falseAlarmCount: 0,
  missCount: 0,
};

function trialReducer(trial: Trial, action: Action) {
  switch (action.type) {
    case "started": {
      const now = Date.now();
      return {
        id: now,
        username: action.name,
        timestamp: now,
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

function LandingScreen({ onStart }: LandingScreenProps) {
  const [name, setName] = useState("");
  return (
    <main>
      <label htmlFor="name">Enter your name</label>
      <input
        id="name"
        placeholder="John Smith"
        onChange={(event) => setName(event?.currentTarget.value)}
      />
      <button onClick={() => onStart(name)}>Start Game</button>
    </main>
  );
}

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const [trial, dispatch] = useReducer(trialReducer, initialTrial);
  const isKeydownRef = useRef(false);
  const alreadyHandledRef = useRef(false);

  const isEnd =
    trial.falseAlarmCount + trial.missCount >= MAX_ERRORS ||
    index >= LETTERS.length;

  const isMatch = useMemo(
    () => index >= 2 && LETTERS[index] === LETTERS[index - 2],
    [index]
  );

  function onStart(name: string) {
    dispatch({ type: "started", name });
    setIndex(0);
  }

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
      if (alreadyHandledRef.current) return;

      isKeydownRef.current = true;
      alreadyHandledRef.current = true;

      dispatch({ type: isMatch ? "identified_correct" : "false_alarm" });
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      alreadyHandledRef.current = false;
    };
  }, [index, isEnd, isMatch]);

  if (!trial.username) return <LandingScreen onStart={onStart} />;

  return (
    <main>
      {!isEnd && <h1>{displayLetter}</h1>}
      {isEnd && (
        <div>
          <h2>Results</h2>
          <p>Total Correct: {trial.correctCount}</p>
          <p>Total False Alarms: {trial.falseAlarmCount}</p>
          <p>Total Misses: {trial.missCount}</p>
        </div>
      )}
    </main>
  );
}
