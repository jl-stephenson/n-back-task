export type Trial = {
  id: number;
  username: string;
  timestamp: number;
  correctCount: number;
  falseAlarmCount: number;
  missCount: number;
};

export type Action =
  | { type: "name_given"; name: string }
  | { type: "started" }
  | { type: "false_alarm" }
  | { type: "identified_correct" }
  | { type: "missed" };
