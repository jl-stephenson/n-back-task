import {
  FormEvent,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";

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
const MAX_LETTERS = 15;

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
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    onStart(name.trim());
  }

  return (
    <main className="grid min-h-svh place-content-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <label htmlFor="name">Enter your name:</label>
        <input
          id="name"
          placeholder="Name"
          value={name}
          className="text-center border-b-2 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(event) => {
            setName(event?.currentTarget.value);
            if (error) setError("");
          }}
          aria-required="true"
        />
        {error && <p role="alert" className="text-red-500">{error}</p>}
        <button type="submit" className="border-2 p-2 hover:cursor-pointer hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">Start Game</button>
      </form>
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
    index >= MAX_LETTERS;

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
        toast.error("Missed match");
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

      if (isMatch) {
        dispatch({ type: "identified_correct" });
        toast.success("Correctly identified match");
      } else {
        dispatch({ type: "false_alarm" });
        toast.error("False alarm");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      alreadyHandledRef.current = false;
    };
  }, [index, isEnd, isMatch]);

  if (trial.username === "") return <LandingScreen onStart={onStart} />;

  return (
    <main className="grid min-h-svh place-content-center">
      {!isEnd && <p className="text-7xl">{displayLetter}</p>}
      {isEnd && (
        <div className="flex flex-col gap-4 items-center text-2xl">
          <h2 className="font-medium">Results:</h2>
          <p className="font-light">Total Correct: {trial.correctCount}</p>
          <p className="font-light">Total False Alarms: {trial.falseAlarmCount}</p>
          <p className="font-light">Total Misses: {trial.missCount}</p>
        </div>
      )}
      <Toaster position="bottom-right" />
    </main>
  );
}
