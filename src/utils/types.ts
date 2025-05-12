export type Trial = {
  id: number;
  username: string;
  timestamp: number;
  correctCount: number;
  falseAlarmCount: number;
  missCount: number;
};

export type Action =
  | { type: "started"; name: string }
  | { type: "false_alarm" }
  | { type: "identified_correct" }
  | { type: "missed" };