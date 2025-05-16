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

export const initialTrial: Trial = {
  id: 0,
  username: "",
  timestamp: 0,
  correctCount: 0,
  falseAlarmCount: 0,
  missCount: 0,
};

export function trialReducer(state: Trial, action: Action) {
  switch (action.type) {
    case "name_given": {
      return {
        ...state,
        username: action.name,
      };
    }
    case "started": {
      const now = Date.now();
      return {
        ...state,
        id: now,
        timestamp: now,
        correctCount: 0,
        falseAlarmCount: 0,
        missCount: 0,
      };
    }
    case "identified_correct": {
      return {
        ...state,
        correctCount: state.correctCount + 1,
      };
    }
    case "false_alarm": {
      return {
        ...state,
        falseAlarmCount: state.falseAlarmCount + 1,
      };
    }
    case "missed": {
      return {
        ...state,
        missCount: state.missCount + 1,
      };
    }
    default: {
      return state;
    }
  }
}
