export interface Task {
  id: string;
  task: string;
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
