import { useNavigate } from "@tanstack/react-router";
import { useTrialContext } from "@/contexts/TrialContext";

export function Results() {
  const { dispatch, state } = useTrialContext();
  const navigate = useNavigate();

  function handleRestart() {
    dispatch({ type: "restart" });
    navigate({ to: "/" });
  }

  return (
    <div className="flex flex-col gap-4 items-center text-2xl">
      <h2 className="font-medium">Results:</h2>
      <p className="font-light">Total Correct: {state.correctCount}</p>
      <p className="font-light">Total False Alarms: {state.falseAlarmCount}</p>
      <p className="font-light">Total Misses: {state.missCount}</p>
      <button
        type="button"
        onClick={handleRestart}
        className="border-2 p-2 hover:cursor-pointer hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mt-4 text-xl w-full max-w-[50ch]"
      >
        Restart
      </button>
    </div>
  );
}
