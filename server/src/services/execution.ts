import { parallelExecution, resolveDependencies } from "./graph.js";
import { tasks, dependencies, stats, type Task } from "../store/index.js";
import { runCommand } from "../lib/process.ts";
function canRun(task: Task): boolean {
  return task.dependency.every((dep) => stats.get(dep) === "success");
}
export async function execute() {
  const { ok, order } = resolveDependencies(dependencies, tasks);
  console.log(order);

  if (!ok) {
    return { ok: false, error: "cycle detected" };
  }

  const parallels = parallelExecution(dependencies, tasks);

  if (!parallels.ok || !parallels.levels) {
    return { ok: false, error: "invalid execution plan" };
  }

  console.log(parallels);
  for (const level of parallels.levels) {
    const runnable: Task[] = level.filter((task) => canRun(task));
    if (runnable.length === 0) {
      break;
    }
    const res = await Promise.allSettled(
      runnable.map((task) => runCommand(task.folder, task.command)),
    );
    res.forEach((r, index) => {
      const task = runnable[index];
      if (r.status === "fulfilled") {
        stats.set(task?.id!, "success");
      } else if (r.status === "rejected") {
        stats.set(task?.id!, "failed");
      }
    });
  }

  return {
    ok: true,
    order,
    levels: parallels.levels,
    stats: Object.fromEntries(stats),
  };
}
