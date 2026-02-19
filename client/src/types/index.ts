export interface Task {
  id: string;
  task: string;
  folder: string;
  command: string;
}

export interface TaskRequest {
  task: string;
  folder: string;
  command: string;
}

export interface Dependency {
  from: string;
  to: string;
}

export interface OrderResponse {
  success: boolean;
  order?: string[];
  cycle?: string;
}

export interface CycleResponse {
  hasCycle: boolean;
  cycle?: number[];
}

export interface ParallelLevel {
  level: number;
  tasks: string[];
}

export interface PathResponse {
  path?: string[];
  error?: string;
}

export type TerminalOpenEvent = {
  type: "terminal_open";
  terminalId: string;
  name: string;
};

export type TaskStartedEvent = {
  type: "task_started";
  terminalId: string;
  taskId: string;
  folder: string;
  command: string;
};

export type TaskStdoutEvent = {
  type: "task_stdout";
  terminalId: string;
  taskId: string;
  data: string;
};

export type TaskStderrEvent = {
  type: "task_stderr";
  terminalId: string;
  taskId: string;
  data: string;
};

export type TaskFinishedEvent = {
  type: "task_finished";
  terminalId: string;
  taskId: string;
  status: "success" | "failed";
};

export type Events =
  | TerminalOpenEvent
  | TaskStartedEvent
  | TaskStdoutEvent
  | TaskStderrEvent
  | TaskFinishedEvent;

export type TerminalUIState = {
  terminalId: string;
  
  status: "running" | "success" | "failed";
  name?: string;
  folder?: string;
};

export type TerminalsState = Record<string, TerminalUIState>;
