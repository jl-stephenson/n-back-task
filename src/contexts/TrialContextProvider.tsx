import { ReactNode, useReducer } from "react";
import { TrialContext } from "./TrialContext";
import { Action, Trial } from "@/utils/types";

const initialTrial: Trial = {
    id: 0,
    username: "",
    timestamp: 0,
    correctCount: 0,
    falseAlarmCount: 0,
    missCount: 0,
  };

  function trialReducer(trial: Trial, action: Action) {
    switch (action.type) {
      case "started": {
        const now = Date.now();
        return {
          id: now,
          username: action.name,
          timestamp: now,
          correctCount: 0,
          falseAlarmCount: 0,
          missCount: 0,
        };
      }
      case "identified_correct": {
        return {
          ...trial,
          correctCount: trial.correctCount + 1,
        };
      }
      case "false_alarm": {
        return {
          ...trial,
          falseAlarmCount: trial.falseAlarmCount + 1,
        };
      }
      case "missed": {
        return {
          ...trial,
          missCount: trial.missCount + 1,
        };
      }
      default: {
        return trial;
      }
    }
  }

export function TrialContextProvider({ children }: { children: ReactNode }) {
    const [trial, dispatch] = useReducer(trialReducer, initialTrial);
  
    return (
      <TrialContext.Provider value={{ trial, dispatch }}>
        {children}
      </TrialContext.Provider>
    );
  }