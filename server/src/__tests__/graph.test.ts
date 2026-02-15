import { test, expect } from "bun:test";
import type { Dependency, Task } from "../store/index.js";
import {
  resolveDependencies,
  shortestPath,
  detectCycle,
  parallelExecution,
  terminalNodes,
  unreachableNodes,
} from "../services/graph.js";

function makeTasks(ids: string[], names?: string[]): Task[] {
  return ids.map((id, i) => ({
    id,
    task: names?.[i] ?? id,
    folder: "/tmp",
    command: "echo " + (names?.[i] ?? id),
    dependency:[]
  }));
}

test("resolveDependencies returns order when DAG", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }, { from: "b", to: "c" }];
  const result = resolveDependencies(deps, tasks);
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.order).toEqual(["A", "B", "C"]);
  }
});

test("resolveDependencies returns cycle when cycle exists", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "a" },
  ];
  const result = resolveDependencies(deps, tasks);
  expect(result.ok).toBe(false);
  if (!result.ok) {
    expect(result.cycle).toBeDefined();
    expect(Array.isArray(result.cycle)).toBe(true);
    expect((result.cycle as string[]).length).toBeGreaterThan(0);
  }
});

test("resolveDependencies single task", () => {
  const tasks = makeTasks(["a"], ["A"]);
  const result = resolveDependencies([], tasks);
  expect(result.ok).toBe(true);
  if (result.ok) expect(result.order).toEqual(["A"]);
});

test("shortestPath returns path when reachable", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }, { from: "b", to: "c" }];
  const path = shortestPath(deps, tasks, "a", "c");
  expect(path).toEqual(["A", "B", "C"]);
});

test("shortestPath returns empty when unreachable", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }];
  const path = shortestPath(deps, tasks, "a", "c");
  expect(path).toEqual([]);
});

test("shortestPath same node returns single element", () => {
  const tasks = makeTasks(["a"], ["A"]);
  const path = shortestPath([], tasks, "a", "a");
  expect(path).toEqual(["A"]);
});

test("detectCycle returns empty when no cycle", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }, { from: "b", to: "c" }];
  const cycle = detectCycle(deps, tasks);
  expect(cycle).toEqual([]);
});

test("detectCycle returns cycle indices when cycle exists", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "a" },
  ];
  const cycle = detectCycle(deps, tasks);
  expect(cycle.length).toBeGreaterThan(0);
  const cycleTasks = cycle.map((i) => tasks[i]!.task);
  expect(cycleTasks).toContain("A");
  expect(cycleTasks).toContain("B");
  expect(cycleTasks).toContain("C");
});

test("parallelExecution returns levels for DAG", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }, { from: "a", to: "c" }];
  const result = parallelExecution(deps, tasks);
  expect(result.ok).toBe(true);
  if (result.ok) {
    expect(result.levels).toBeDefined();
    expect(result.levels!.length).toBe(2);
    const level0Tasks = result.levels![0]!.map((t) => t.task);
    const level1Tasks = result.levels![1]!.map((t) => t.task).sort();
    expect(level0Tasks).toContain("A");
    expect(level1Tasks).toEqual(["B", "C"]);
  }
});

test("parallelExecution returns not ok when cycle", () => {
  const tasks = makeTasks(["a", "b"], ["A", "B"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }, { from: "b", to: "a" }];
  const result = parallelExecution(deps, tasks);
  expect(result.ok).toBe(false);
});

test("terminalNodes returns nodes with no outgoing edges", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }];
  const terminals = terminalNodes(deps, tasks);
  expect(terminals.length).toBe(2);
  const names = terminals.map((i) => tasks[i]!.task);
  expect(names).toContain("B");
  expect(names).toContain("C");
});

test("unreachableNodes returns nodes not reachable from any source", () => {
  const tasks = makeTasks(["a", "b", "c"], ["A", "B", "C"]);
  const deps: Dependency[] = [
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "a" },
  ];
  const unreachable = unreachableNodes(deps, tasks);
  expect(unreachable.length).toBe(3);
  const names = unreachable.map((i) => tasks[i]!.task);
  expect(names).toContain("A");
  expect(names).toContain("B");
  expect(names).toContain("C");
});

test("unreachableNodes returns empty when all reachable", () => {
  const tasks = makeTasks(["a", "b"], ["A", "B"]);
  const deps: Dependency[] = [{ from: "a", to: "b" }];
  const unreachable = unreachableNodes(deps, tasks);
  expect(unreachable).toEqual([]);
});
