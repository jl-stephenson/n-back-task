import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTrialContext } from "@/contexts/TrialContext";

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

export function Task() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);

  const isKeydownRef = useRef(false);
  const alreadyHandledRef = useRef(false);

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

  useEffect(() => {
    if (isEnd) {
      navigate({ to: "/results" });
      return;
    }

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
  }, [dispatch, index, isEnd, isMatch, navigate]);

  useEffect(() => {
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
  }, [dispatch, isMatch]);

  return <p className="text-7xl">{displayLetter}</p>;
}
