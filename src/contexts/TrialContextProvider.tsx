import { ReactNode, useReducer } from "react";
import { TrialContext } from "./TrialContext";
import { Action, Trial } from "@/types/index";

const initialTrial: Trial = {
    id: 0,
    username: "",
    timestamp: 0,
    correctCount: 0,
    falseAlarmCount: 0,
    missCount: 0,
  };

  function trialReducer(state: Trial, action: Action) {
    switch (action.type) {
      case "name_given": {
        return {
          ...state,
          username: action.name,
        }
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

export function TrialContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(trialReducer, initialTrial);
  
    return (
      <TrialContext.Provider value={{ state, dispatch }}>
        {children}
      </TrialContext.Provider>
    );
  }