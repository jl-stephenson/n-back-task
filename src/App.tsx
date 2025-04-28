import { useEffect, useRef, useState } from "react";

const LETTERS = ["A", "B", "A", "D", "E", "F", "E"];

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);
  const currentLetterRef = useRef("");

  useEffect(() => {
    if (index >= LETTERS.length) return;

    currentLetterRef.current = LETTERS[index];

    setDisplayLetter(LETTERS[index]);
    const hideTimeout = setTimeout(() => {
      setDisplayLetter("");
    }, 500);

    const nextLetterTimeout = setTimeout(() => {
      setIndex((index) => index + 1);
    }, 3000);

    return () => {
      clearInterval(hideTimeout);
      clearInterval(nextLetterTimeout);
    };
  }, [index]);

  return (
    <>
      <div>
        <h1>{displayLetter}</h1>
      </div>
    </>
  );
}
