import { Router } from "express";
import crypto from "crypto";
import { tasks, dependencies } from "./store.js";
import { detectCycle, parallelExecution, resolveDependencies, shortestPath, terminalNodes, unreachableNodes } from "./graph.js";

const router = Router();

router.get("/tasks", (_, res) => {
  res.json({ tasks, dependencies });
});

router.post("/task", (req, res) => {
  const t = { task: req.body.task, id: crypto.randomUUID() };
  console.log(t);
  
  tasks.push(t);
  res.json(t);
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

router.get("/cycle",(req,res)=>{
    res.json(detectCycle(dependencies,tasks));
})

router.get("/parallel",(req,res)=>{
  res.json(parallelExecution(dependencies,tasks));
})

router.get("/terminal", (req, res) => {
  const indices = terminalNodes(dependencies, tasks);
  res.json(indices.map(i => tasks[i]!.task));
});

router.get("/unreachable", (req, res) => {
  const indices = unreachableNodes(dependencies, tasks);
  res.json(indices.map(i => tasks[i]!.task));
});

export default router;
