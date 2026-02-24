import type { ChildProcess } from "child_process";

type StepState =
  | "idle"
  | "starting"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "stopped";

type ReadyWhen =
  | { kind: "exit" }
  | { kind: "port"; port: number }
  | { kind: "log"; match: string | RegExp };

export type Task = {
  id: string;
  task: string;
  command: string;
  folder: string;
  dependency: string[];
  type: "job" | "service";
  state: StepState;
  ready?: ReadyWhen;
};
export type Dependency = { from: string; to: string };
export type TaskStatus = "success" | "failed" | "pending" | "skipped";

export const taskState: Map<string, TaskStatus> = new Map<string, TaskStatus>();
export const terminal: Map<string, { terminalId: string; taken: boolean }> =
  new Map<string, { terminalId: string; taken: boolean }>();

export const tasks: Task[] = [];
export const dependencies: Dependency[] = [];
export const runningProcesses = new Map<string, ChildProcess>();
