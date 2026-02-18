import { parallelExecution, resolveDependencies } from "./graph.js";
import { tasks, dependencies, stats, type Task } from "../store/index.js";
import { runCommand } from "../lib/process.ts";
import type { Response } from "express";

function canRun(task: Task): boolean {
  return task.dependency.every((dep) => stats.get(dep) === "success");
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
        stats.set(task?.id!, "success");
      } else if (result.status === "rejected") {
        stats.set(task?.id!, "failed");
      }
    });
  }


}
