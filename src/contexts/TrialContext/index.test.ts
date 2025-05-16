import { describe, expect, it, vi } from "vitest";
import { initialTrial, trialReducer } from ".";
import type { Action, Trial } from "@/types/index";

describe("trialReducer", () => {
  it("sets the username on name_given action", () => {
    const action: Action = { type: "name_given", name: "test" };
    const expectedState = {
      ...initialTrial,
      username: "test",
    };
    expect(trialReducer(initialTrial, action)).toEqual(expectedState);
  });

  it("should handle started action", () => {
    const mockTimestamp = 1234567890;
    vi.spyOn(Date, "now").mockReturnValue(mockTimestamp);

    const action: Action = { type: "started" };
    const expectedState: Trial = {
      ...initialTrial,
      id: mockTimestamp,
      timestamp: mockTimestamp,
      correctCount: 0,
      falseAlarmCount: 0,
      missCount: 0,
    };

    expect(trialReducer(initialTrial, action)).toEqual(expectedState);
    vi.restoreAllMocks();
  });
});
