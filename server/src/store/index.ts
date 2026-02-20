import type { ChildProcess } from "child_process";

export type Task = {
  id: string;
  task: string;
  command: string;
  folder: string;
  dependency: string[];
};
export type Dependency = { from: string; to: string };
export type TaskStatus = "success" | "failed" | "pending" | "skipped";

export const stats: Map<string, TaskStatus> = new Map<string, TaskStatus>();
export const terminal: Map<string, { terminalId: string; taken: boolean }> = new Map<string,  { terminalId: string; taken: boolean }>();

export const tasks: Task[] = [];
export const dependencies: Dependency[] = [];
export const runningProcesses = new Map<string, ChildProcess>();
