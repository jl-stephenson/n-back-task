import { Action, Trial } from "@/utils/types";
import {
  createContext,
  Dispatch,
  useContext,
} from "react";

type TrialContext = { trial: Trial; dispatch: Dispatch<Action> };

export const TrialContext = createContext<TrialContext | null>(null);

export function useTrialContext() {
  const context = useContext(TrialContext);

  if (!context) {
    throw new Error(
      "TrialContext not found. Make sure the components is wrapped in Provider.",
    );
  }

  return context;
}


