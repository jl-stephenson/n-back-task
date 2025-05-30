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

  it("correctly handles started action", () => {
    const mockTimestamp = 1234567890;
    vi.useFakeTimers({ now: mockTimestamp });

    try {
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
    } finally {
      vi.useRealTimers();
    }
  });

  it("correctly handles identified_correct action", () => {
    const initialState = { ...initialTrial, correctCount: 1 };
    const expectedState = { ...initialTrial, correctCount: 2 };
    const action: Action = { type: "identified_correct" };

    expect(trialReducer(initialState, action)).toEqual(expectedState);
  });

  it("correctly handles false_alarm action", () => {
    const initialState = { ...initialTrial, falseAlarmCount: 1 };
    const expectedState = { ...initialTrial, falseAlarmCount: 2 };
    const action: Action = { type: "false_alarm" };

    expect(trialReducer(initialState, action)).toEqual(expectedState);
  });

  it("correctly handles missed action", () => {
    const initialState = { ...initialTrial, missCount: 1 };
    const expectedState = { ...initialTrial, missCount: 2 };
    const action: Action = { type: "missed" };

    expect(trialReducer(initialState, action)).toEqual(expectedState);
  });

  it("correctly handles restart action", () => {
    const initialState = { ...initialTrial, username: "Test", correctCount: 1 };
    const expectedState = initialTrial;
    const action: Action = { type: "restart" };

    expect(trialReducer(initialState, action)).toEqual(expectedState);
  });
});
