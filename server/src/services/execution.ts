import { parallelExecution, resolveDependencies } from "./graph.js";
import {
  tasks,
  dependencies,
  taskState,
  type Task,
  runningProcesses,
} from "../store/index.js";
import { runCommand } from "../lib/process.ts";
import type { Response } from "express";

function canRun(task: Task): boolean {
  return task.dependency.every((dep) => taskState.get(dep) === "success");
}

export async function execute(res: Response) {
  const { ok, order } = resolveDependencies(dependencies, tasks);

  if (!ok) {
    return { ok: false, error: "cycle detected" };
  }

  const parallels = parallelExecution(dependencies, tasks);

  if (!parallels.ok || !parallels.levels) {
    return { ok: false, error: "invalid execution plan" };
  }
  for (const level of parallels.levels) {
    const runnable: Task[] = level.filter((task) => canRun(task));

    if (runnable.length === 0) {
      break;
    }
    const results = await Promise.allSettled(
      runnable.map((task) => runCommand(task, res)),
    );

    results.forEach((result, index) => {
      const task = runnable[index];
      if (result.status === "fulfilled") {
        taskState.set(task?.id!, "success");
        task!.state = "completed"
      } else if (result.status === "rejected") {
        taskState.set(task?.id!, "failed");
        task!.state = "failed"
      }
    });
  }

  return {
    ok: true,
    order,
    levels: parallels.levels.map((level) => level.map((t) => t.id)),
    stats: Object.fromEntries(taskState),
  };
}

export const stopExecution = () => {
  for (const [, child] of runningProcesses) {
    if (!child.pid) continue;
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      continue;
    }
    setTimeout(() => {
      try {
        process.kill(-child.pid!, 0);
        process.kill(-child.pid!, "SIGKILL");
      } catch {}
    }, 3000);
  }
  runningProcesses.clear();
  return true;
};

export const stopProcess = (id: string) => {
  const child = runningProcesses.get(id);

  if (!child || !child.pid) return false;
  try {
    process.kill(-child.pid, "SIGTERM");
    // signal to the entire process group
  } catch {
    return false;
  }
  setTimeout(() => {
    try {
      process.kill(-child.pid!, 0);
      process.kill(-child.pid!, "SIGKILL");
    } catch {}
  }, 3000);
  return true;
};
