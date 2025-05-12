import { useTrialContext } from "@/contexts/TrialContext";

export function Results() {
  const { trial } = useTrialContext();
  return (
    <div className="flex flex-col gap-4 items-center text-2xl">
      <h2 className="font-medium">Results:</h2>
      <p className="font-light">Total Correct: {trial.correctCount}</p>
      <p className="font-light">Total False Alarms: {trial.falseAlarmCount}</p>
      <p className="font-light">Total Misses: {trial.missCount}</p>
    </div>
  );
}
