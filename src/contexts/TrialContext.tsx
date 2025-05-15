import { Action, Trial } from "@/types/index";
import { createContext, Dispatch, useContext } from "react";

type TrialContext = { state: Trial; dispatch: Dispatch<Action> };

export const TrialContext = createContext<TrialContext | null>(null);

export function useTrialContext() {
  const context = useContext(TrialContext);

  if (!context) {
    throw new Error(
      "TrialContext not found. Make sure the component is wrapped in Provider.",
    );
  }

  return context;
}
