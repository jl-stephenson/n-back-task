import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useEventListener, useInterval } from "usehooks-ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    isEnd ? null : 3000,
  );

  useEffect(() => {
    if (isEnd) {
      navigate({ to: "/results" });
      return;
    }
    setDisplayLetter(LETTERS[index]);

    const hideTimeout = setTimeout(() => setDisplayLetter(""), 500);

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
