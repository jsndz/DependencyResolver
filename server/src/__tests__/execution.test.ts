import { test, expect, beforeEach, mock } from "bun:test";
import { tasks, dependencies, stats, terminal } from "../store";
import { execute } from "../services/execution";
import type { Task } from "../store";


mock.module("../lib/process.ts", () => ({
  runCommand: async (task: Task) => {
    // simulate async execution
    await new Promise((r) => setTimeout(r, 1));
    return;
  },
}));


function makeTask(
  id: string,
  task: string,
  dependency: string[] = [],
): Task {
  return {
    id,
    task,
    dependency,
    folder: "/tmp",
    command: "echo " + task,
  };
}

function fakeRes() {
  return {
    writes: [] as string[],
    write(chunk: string) {
      this.writes.push(chunk);
    },
  } as any;
}



beforeEach(() => {
  tasks.length = 0;
  dependencies.length = 0;
  stats.clear();
  terminal.clear();
});



test("cycle prevents execution", async () => {
  tasks.push(
    makeTask("a", "A"),
    makeTask("b", "B"),
    makeTask("c", "C"),
  );

  dependencies.push(
    { from: "a", to: "b" },
    { from: "b", to: "c" },
    { from: "c", to: "a" },
  );

  const res = fakeRes();
  const result = await execute(res);

  expect(result!.ok).toBe(false);
  expect(result!.error).toBe("cycle detected");
  expect(stats.size).toBe(0);
});

test("simple linear execution", async () => {
  tasks.push(
    makeTask("a", "A"),
    makeTask("b", "B", ["a"]),
    makeTask("c", "C", ["b"]),
  );

  dependencies.push(
    { from: "a", to: "b" },
    { from: "b", to: "c" },
  );

  const res = fakeRes();
  const result = await execute(res);

  expect(result!.ok).toBe(true);
  expect(stats.get("a")).toBe("success");
  expect(stats.get("b")).toBe("success");
  expect(stats.get("c")).toBe("success");
});

test("parallel branches execute together", async () => {
  tasks.push(
    makeTask("a", "A"),
    makeTask("b", "B", ["a"]),
    makeTask("c", "C", ["a"]),
    makeTask("d", "D", ["b", "c"]),
  );

  dependencies.push(
    { from: "a", to: "b" },
    { from: "a", to: "c" },
    { from: "b", to: "d" },
    { from: "c", to: "d" },
  );

  const res = fakeRes();
  const result = await execute(res);

  expect(result!.ok).toBe(true);
  expect(stats.get("a")).toBe("success");
  expect(stats.get("b")).toBe("success");
  expect(stats.get("c")).toBe("success");
  expect(stats.get("d")).toBe("success");
});



test("tasks do not run if dependency fails", async () => {
  // Override runCommand for this test only
  mock.module("../lib/process.ts", () => ({
    runCommand: async (task: Task) => {
      if (task.id === "a") throw new Error("boom");
    },
  }));

  tasks.push(
    makeTask("a", "A"),         
    makeTask("b", "B", ["a"]),
  );

  dependencies.push({ from: "a", to: "b" });

  const res = fakeRes();
  await execute(res);

  expect(stats.get("a")).toBe("failed");
  expect(stats.get("b")).toBe(undefined); // never ran
});

test("empty workflow is valid", async () => {
  const res = fakeRes();
  const result = await execute(res);

  expect(result!.ok).toBe(true);
  expect(stats.size).toBe(0);
});
