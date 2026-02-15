export type Task = { id: string; task: string };
export type Dependency = { from: string; to: string };

export const tasks: Task[] = [];
export const dependencies: Dependency[] = [];