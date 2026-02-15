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
export const tasks: Task[] = [];
export const dependencies: Dependency[] = [];
