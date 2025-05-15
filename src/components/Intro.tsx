import { useNavigate } from "@tanstack/react-router";
import { useTrialContext } from "@/contexts/TrialContext";

export function Intro() {
  const navigate = useNavigate();
  const { dispatch } = useTrialContext();

  function handleClick() {
    dispatch({ type: "started" });
    navigate({ to: "/task" });
  }
  return (
    <div className="max-w-1/2 mx-auto flex flex-col gap-4">
      <h2 className="text-center text-2xl font-medium">
        Welcome to the N-Back Game
      </h2>
      <p className="max-w-[50ch]">
        In this game, you will see letters. Each letter is shown for 0.5
        seconds. You have 3 seconds total per letter to decide if you saw the
        same letter 2 letters ago.
      </p>
      <p>
        If you saw the same letter 2 letters ago, press the{" "}
        <kbd className="border-2 px-1 font-mono">m</kbd> key. The game will end
        after two errors, or once the sequence of letters is complete.
      </p>
      <button
        type="button"
        onClick={handleClick}
        className="border-2 p-2 hover:cursor-pointer hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 text-xl"
      >
        Start Game
      </button>
    </div>
  );
}
