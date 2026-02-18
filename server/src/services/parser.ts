import { tasks, type Dependency, type Task } from "../store";
import { stringify } from "yaml";
interface DagTask {
  folder: string;
  command: string;
  dependsOn?: string[];
}

type Dag = {
  version: number;
  name: string;
  tasks: Record<string, DagTask>;
};

function normalizeId(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".");
}

export function WorkFlowToDAG(
  tasks: Task[],
  deps: Dependency[],
  workflowName: string,
  version: number,
): Dag {
  const taskRecord: Record<string, DagTask> = {};

  for (const t of tasks) {
    const id = normalizeId(t.task);

    taskRecord[id] = {
      folder: t.folder,
      command: t.command,
      dependsOn: [],
    };
  }

  for (const d of deps) {
    const from = normalizeId(tasks.find((t) => t.id === d.from)!.task);
    const to = normalizeId(tasks.find((t) => t.id === d.to)!.task);

    taskRecord[to]!.dependsOn!.push(from);
  }

  return {
    version,
    name: workflowName,
    tasks: taskRecord,
  };
}

export function dagToYaml(dag: Dag): string {
  return stringify(dag);
}


