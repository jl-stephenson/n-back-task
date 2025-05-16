import { ReactNode, useReducer } from "react";
import { TrialContext } from "../TrialContext";
import { trialReducer, initialTrial } from "../TrialContext";

export function TrialContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(trialReducer, initialTrial);

  return (
    <TrialContext.Provider value={{ state, dispatch }}>
      {children}
    </TrialContext.Provider>
  );
}
