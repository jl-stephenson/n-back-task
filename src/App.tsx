import { useEffect, useState } from "react";

export default function App() {
  const [displayLetter, setDisplayLetter] = useState("");
  const [index, setIndex] = useState(0);

  const array = ["A", "B", "C", "D", "E", "F"];

  useEffect(() => {
    if (index >= array.length) return;

    setDisplayLetter(array[index]);

    const hideInterval = setInterval(() => {
      setDisplayLetter("");
    }, 500);

    const nextLetterInterval = setInterval(() => {
      setIndex((index) => index + 1);
    }, 3000);

    return () => {
      clearInterval(hideInterval);
      clearInterval(nextLetterInterval)};
  }, [array.length, index]);

  return (
    <>
      <div>
        <h1>{displayLetter}</h1>
      </div>
    </>
  );
}
