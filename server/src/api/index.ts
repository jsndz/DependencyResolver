import { Router, type Response } from "express";
import crypto from "crypto";
import { tasks, dependencies, type Task } from "../store/index.js";
import {
  detectCycle,
  parallelExecution,
  resolveDependencies,
  shortestPath,
  terminalNodes,
  unreachableNodes,
} from "../services/graph.js";
import { execute, stopExecution, stopProcess } from "../services/execution.js";
import {
  yamlToDag,
  dagToWorkflow,
  dagToYaml,
  WorkFlowToDAG,
} from "../services/parser.js";
import { getSystemStats } from "../lib/os.js";

const router = Router();

router.get("/tasks", (_, res) => {
  res.json({ tasks, dependencies });
});

router.post("/task", (req, res) => {
  const t: Task = {
    task: req.body.task,
    id: crypto.randomUUID(),
    folder: req.body.folder,
    command: req.body.command,
    dependency: [],
    type: req.body.type,
    state:"idle",
    ready: req.body.type === "service" ? req.body.ready : { kind: "exit" },
  };
  tasks.push(t);
  res.json(t);
});

router.put("/task/:id", (req, res) => {
  const id = req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.body.task) task.task = req.body.task;
  if (req.body.folder) task.folder = req.body.folder;
  if (req.body.command) task.command = req.body.command;
  if (req.body.type) task.type = req.body.type;
  if (req.body.ready) task.ready = req.body.ready;

  res.json(task);
});

router.delete("/task/:id", (req, res) => {
  const id = req.params.id;

  const idx = tasks.findIndex((t) => t.id === id);
  if (idx !== -1) tasks.splice(idx, 1);

  for (let i = dependencies.length - 1; i >= 0; i--) {
    if (dependencies[i]!.from === id || dependencies[i]!.to === id) {
      dependencies.splice(i, 1);
    }
  }

  res.json({ ok: true });
});

router.post("/dependency", (req, res) => {
  dependencies.push(req.body);
  const t = tasks.find((t) => t.id === req.body.to);
  t?.dependency.push(req.body.from);
  res.json({ ok: true });
});

router.delete("/dependency", (req, res) => {
  const { from, to } = req.body;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing from or to" });
  }

  const idx = dependencies.findIndex((d) => d.from === from && d.to === to);
  if (idx === -1) {
    return res.status(404).json({ error: "Dependency not found" });
  }

  dependencies.splice(idx, 1);

  const task = tasks.find((t) => t.id === to);
  if (task) {
    const depIdx = task.dependency.indexOf(from);
    if (depIdx !== -1) {
      task.dependency.splice(depIdx, 1);
    }
  }

  res.json({ ok: true });
});

router.get("/order", (_, res) => {
  res.json(resolveDependencies(dependencies, tasks));
});

router.get("/path", (req, res) => {
  const from = req.query.from;
  const to = req.query.to;

  if (typeof from !== "string" || typeof to !== "string") {
    return res.status(400).json({ error: "Invalid from or to" });
  }

  res.json(shortestPath(dependencies, tasks, from, to));
});

router.get("/cycle", (req, res) => {
  res.json(detectCycle(dependencies, tasks));
});

router.get("/parallel", (req, res) => {
  res.json(parallelExecution(dependencies, tasks));
});

router.get("/terminal", (req, res) => {
  const indices = terminalNodes(dependencies, tasks);
  res.json(indices.map((i) => tasks[i]!.task));
});

router.get("/unreachable", (req, res) => {
  const indices = unreachableNodes(dependencies, tasks);
  res.json(indices.map((i) => tasks[i]!.task));
});

router.get("/execute", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  req.on("close", () => {
    console.log("wanted to close connection by /eexcute");
    
    stopExecution();
  });
  const result = await execute(res);
  res.write(
    `data: ${JSON.stringify({
      type: "execution_finished",
      result,
    })}\n\n`,
  );

  // res.end();
});

router.post("/yaml", (req, res) => {
  const yaml = req.body?.yaml;
  if (typeof yaml !== "string") {
    return res.status(400).json({ error: "Missing yaml in body" });
  }
  console.log("hello");

  try {
    const dag = yamlToDag(yaml);
    const { tasks: newTasks, dependencies: newDeps } = dagToWorkflow(
      dag as any,
    );

    tasks.length = 0;
    dependencies.length = 0;

    for (const t of newTasks) tasks.push(t as any);
    for (const d of newDeps) dependencies.push(d as any);
    console.log(tasks, dependencies);

    res.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err?.message ?? String(err) });
  }
});

router.get("/yaml/:workflow", (req, res) => {
  try {
    const dag = WorkFlowToDAG(tasks, dependencies, req.params.workflow, 1);
    const yaml = dagToYaml(dag);
    res.setHeader("Content-Type", "application/x-yaml");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${req.params.workflow}.yaml"`,
    );

    res.send(yaml);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get("/execution/stop", async (req, res) => {
  try {
    const r = await stopExecution();
        console.log("wanted to close connection by /execution/stop");

    if (r) {
      res.json({ ok: true });
    }
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get("/task/:id/stop", (req, res) => {
  try {
    const id = req.params.id;
    const r = stopProcess(id);
    res.json({ ok: r });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
});

router.get("/system/stats", (req, res) => {
  try {
    const stats = getSystemStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
