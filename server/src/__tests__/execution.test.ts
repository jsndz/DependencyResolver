import { test, expect, beforeEach } from "bun:test";
import type { Task } from "../store/index.js";
import { tasks, dependencies, stats } from "../store/index.js";
import { execute } from "../services/execution.js";

function makeTask(
  id: string,
  task: string,
  dependency: string[],
  folder = "/tmp",
  command = "echo " + task,
): Task {
  return { id, task, folder, command, dependency };
}

beforeEach(() => {
  tasks.length = 0;
  dependencies.length = 0;
  stats.clear();
});

test("execute returns error when dependency graph has a cycle", async () => {
  tasks.push(
    makeTask("a", "A", []),
    makeTask("b", "B", []),
    makeTask("c", "C", []),
  );
  dependencies.push(
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "a" },
  );

  const result = await execute();

  expect(result).toHaveProperty("ok", false);
  expect(result).toHaveProperty("error", "cycle detected");
  expect(stats.size).toBe(0);
});

test("execute complex tasks properly", async () => {
  tasks.push(
    makeTask("a", "eat", []),

    makeTask("b", "cook", ["a"]),
    makeTask("c", "shop", ["a"]),

    makeTask("d", "clean", ["b", "c"]),

    makeTask("e", "sleep", ["d"]),
  );

  dependencies.push(
    { from: "a", to: "b" },
    { from: "a", to: "c" },
  
    { from: "b", to: "d" },
    { from: "c", to: "d" },
  
    { from: "d", to: "e" },
  );

  const result = await execute();

  expect(result.ok).toBe(true);

  expect(result.order![0]).toBe("eat");
  expect(result.order!.at(-1)).toBe("sleep");

  expect(result.order).toEqual(
    expect.arrayContaining(["eat", "cook", "shop", "clean", "sleep"]),
  );

  expect(result.levels).toHaveLength(4);

  expect(result.levels![0]!.map(t => t.id)).toEqual(["a"]);

  expect(result.levels![1]!.map(t => t.id)).toEqual(
    expect.arrayContaining(["b", "c"]),
  );

  expect(result.levels![2]!.map(t => t.id)).toEqual(["d"]);
  expect(result.levels![3]!.map(t => t.id)).toEqual(["e"]);

  expect(result.stats).toEqual({
    a: "success",
    b: "success",
    c: "success",
    d: "success",
    e: "success",
  });

 
});

test("execute returns ok, order, and levels for a DAG", async () => {
  tasks.push(
    makeTask("a", "A", []),
    makeTask("b", "B", []),
    makeTask("c", "C", []),
  );
  dependencies.push({ from: "a", to: "b" }, { from: "a", to: "c" });

  const result = await execute();

  expect(result).toHaveProperty("ok", true);
  expect(result).toHaveProperty("order");
  expect(result).toHaveProperty("levels");
  if (typeof result === "object" && result && "order" in result) {
    const r = result as { order: string[] };
    expect(r.order).toContain("A");
    expect(r.order).toHaveLength(3);
  }
  if (typeof result === "object" && result && "levels" in result) {
    const r = result as { levels: unknown[] };
    expect(Array.isArray(r.levels)).toBe(true);
    expect(r.levels.length).toBeGreaterThan(0);
  }
});

test("execute runs commands and records success in stats", async () => {
  tasks.push(makeTask("a", "A", []), makeTask("b", "B", []));
  dependencies.push({ from: "a", to: "b" });

  const result = await execute();

  expect(result).toHaveProperty("ok", true);
  const r = result as { ok: boolean; stats?: Record<string, string> };
  expect(r.stats).toBeDefined();
  expect(r.stats!["a"]).toBe("success");
  expect(r.stats!["b"]).toBe("success");
});

test("execute with empty tasks returns ok and empty order", async () => {
  const result = await execute();

  expect(result).toHaveProperty("ok", true);
  if (typeof result === "object" && result && "order" in result) {
    expect((result as { order: string[] }).order).toEqual([]);
  }
  expect(stats.size).toBe(0);
});
