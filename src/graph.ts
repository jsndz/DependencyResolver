import type { Dependency, Task } from "./store";
import { Queue } from "./structures/queue";

function buildAL(
  dependencies: Dependency[],
  tasks: Task[],
  idToIndex: Map<string, number>
) {
  const al: number[][] = Array.from({ length: tasks.length }, () => []);
  for (const dep of dependencies) {
    const a = idToIndex.get(dep.from)!;
    const b = idToIndex.get(dep.to)!;
    al[a]!.push(b);
  }
  return al;
}

export function resolveDependencies(
  dependencies: Dependency[],
  tasks: Task[]
) {
  const idToIndex = new Map<string, number>();
  tasks.forEach((t, i) => idToIndex.set(t.id, i));

  const al = buildAL(dependencies, tasks, idToIndex);
  const indeg = Array(al.length).fill(0);

  for (const n of al) for (const v of n) indeg[v]++;

  const q:Queue =  new Queue();
  indeg.forEach((d, i) => d === 0 && q.push(i));

  const res: string[] = [];
  while (!q.empty()) {
    const u = q.front();
    if (u === undefined) break;
    q.pop();
    res.push(tasks[u]!.task);
    for (const v of al[u]!) {
      if (--indeg[v] === 0) q.push(v);
    }
  }

  return res.length === tasks.length ? res : [];
}

export function shortestPath(
  dependencies: Dependency[],
  tasks: Task[],
  from: string,
  to: string
) {
  const idToIndex = new Map<string, number>();
  tasks.forEach((t, i) => idToIndex.set(t.id, i));

  const src = idToIndex.get(from)!;
  const dst = idToIndex.get(to)!;
  const al = buildAL(dependencies, tasks, idToIndex);

  const q: Queue= new Queue();
  q.push(src);
  const parent = Array(al.length).fill(-1);
  const vis = Array(al.length).fill(false);
  vis[src] = true;

  while (!q.empty()) {
    const u = q.front()!;
    q.pop();
    if (u === dst) break;
    for (const v of al[u]!) {
      if (!vis[v]) {
        vis[v] = true;
        parent[v] = u;
        q.push(v);
      }
    }
  }

  if (!vis[dst]) return [];

  const path: string[] = [];
  for (let i = dst; i !== -1; i = parent[i]) {
    path.push(tasks[i]!.task);
  }
  return path.reverse();
}