import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useEventListener, useInterval } from "usehooks-ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTrialContext } from "@/contexts/TrialContext";

const DEFAULT_LETTERS = [
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

function getLetterSequence(): string[] {
  const testLetters = import.meta.env.VITE_TEST_LETTERS;
  if (testLetters) {
    try {
      const parsedLetters = JSON.parse(testLetters);
      if (
        Array.isArray(parsedLetters) &&
        parsedLetters.every((item) => typeof item === "string")
      ) {
        return parsedLetters;
      }
      console.warn(
        "VITE_TEST_LETTERS must be an array of strings, using default letters",
      );
    } catch {
      console.warn("Invalid VITE_TEST_LETTERS, using default letters");
    }
  }
  return DEFAULT_LETTERS;
}

const LETTERS = getLetterSequence();
const MAX_ERRORS = 2;
const MAX_LETTERS = 15;
const DISPLAY_MS = Number(import.meta.env.VITE_DISPLAY_MS) || 500;
const LETTER_MS = Number(import.meta.env.VITE_LETTER_MS) || 3000;

export function Task() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);

  const keyHandledRef = useRef(false);

  const { state, dispatch } = useTrialContext();

  const navigate = useNavigate();

  const isEnd = useMemo(
    () =>
      state.falseAlarmCount + state.missCount >= MAX_ERRORS ||
      index >= MAX_LETTERS,
    [index, state.falseAlarmCount, state.missCount],
  );

  const isMatch = useMemo(
    () => index >= 2 && LETTERS[index] === LETTERS[index - 2],
    [index],
  );

  useInterval(
    () => {
      if (isEnd) return;

      if (isMatch && !keyHandledRef.current) {
        dispatch({ type: "missed" });
        toast.error("Missed match");
      }
      keyHandledRef.current = false;
      setIndex((index) => index + 1);
    },
    isEnd ? null : LETTER_MS,
  );

  useEffect(() => {
    if (isEnd) {
      navigate({ to: "/results" });
      return;
    }
    setDisplayLetter(LETTERS[index]);

    const hideTimeout = setTimeout(() => setDisplayLetter(""), DISPLAY_MS);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, [index, isEnd, navigate]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "m" || keyHandledRef.current) return;

      keyHandledRef.current = true;

      if (isMatch) {
        dispatch({ type: "identified_correct" });
        toast.success("Correctly identified match");
      } else {
        dispatch({ type: "false_alarm" });
        toast.error("False alarm");
      }
    },
    [dispatch, isMatch],
  );

  useEventListener("keydown", handleKeyDown);

  return (
    <p className="text-7xl" data-testid="display-letter">
      {displayLetter}
    </p>
  );
}
