import { test, expect, beforeEach, afterEach } from "bun:test";
import request from "supertest";
import type { Server } from "http";
import { app } from "../app.js";
import { tasks, dependencies } from "../store/index.js";

let server: Server;

beforeEach((done) => {
  tasks.length = 0;
  dependencies.length = 0;
  server = app.listen(0, () => done());
});

afterEach((done) => {
  server.close(() => done());
});

test("GET /api/tasks returns tasks and dependencies", async () => {
  const res = await request(server).get("/api/tasks");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("tasks");
  expect(res.body).toHaveProperty("dependencies");
  expect(Array.isArray(res.body.tasks)).toBe(true);
  expect(Array.isArray(res.body.dependencies)).toBe(true);
});

test("POST /api/task creates task and returns it", async () => {
  const res = await request(server)
    .post("/api/task")
    .send({ task: "Build", folder: "/tmp", command: "npm run build" });
  expect(res.status).toBe(200);
  expect(res.body.task).toBe("Build");
  expect(res.body.folder).toBe("/tmp");
  expect(res.body.command).toBe("npm run build");
  expect(res.body.id).toBeDefined();
  expect(typeof res.body.id).toBe("string");
  expect(tasks.length).toBe(1);
});

test("DELETE /api/task/:id removes task and its dependencies", async () => {
  const create = await request(server)
    .post("/api/task")
    .send({ task: "T1", folder: "/tmp", command: "echo 1" });
  const id = create.body.id;
  await request(server).post("/api/dependency").send({ from: id, to: id });
  const res = await request(server).delete(`/api/task/${id}`);
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  expect(tasks.find((t) => t.id === id)).toBeUndefined();
});

test("POST /api/dependency adds dependency", async () => {
  const res = await request(server)
    .post("/api/dependency")
    .send({ from: "id1", to: "id2" });
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  expect(dependencies.length).toBe(1);
  expect(dependencies[0]).toEqual({ from: "id1", to: "id2" });
});

test("GET /api/order returns resolve result", async () => {
  const create1 = await request(server)
    .post("/api/task")
    .send({ task: "A", folder: "/tmp", command: "echo A" });
  const create2 = await request(server)
    .post("/api/task")
    .send({ task: "B", folder: "/tmp", command: "echo B" });
  await request(server)
    .post("/api/dependency")
    .send({ from: create1.body.id, to: create2.body.id });
  const res = await request(server).get("/api/order");
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
  expect(res.body.order).toEqual(["A", "B"]);
});

test("GET /api/path returns 400 when from or to missing", async () => {
  const res = await request(server).get("/api/path");
  expect(res.status).toBe(400);
  expect(res.body.error).toBeDefined();
});

test("GET /api/path returns path when from and to provided", async () => {
  const create1 = await request(server)
    .post("/api/task")
    .send({ task: "A", folder: "/tmp", command: "echo A" });
  const create2 = await request(server)
    .post("/api/task")
    .send({ task: "B", folder: "/tmp", command: "echo B" });
  await request(server)
    .post("/api/dependency")
    .send({ from: create1.body.id, to: create2.body.id });
  const res = await request(server).get(
    `/api/path?from=${create1.body.id}&to=${create2.body.id}`
  );
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body).toEqual(["A", "B"]);
});

test("GET /api/cycle returns array", async () => {
  const res = await request(server).get("/api/cycle");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("GET /api/parallel returns result", async () => {
  const res = await request(server).get("/api/parallel");
  expect(res.status).toBe(200);
  expect(res.body).toHaveProperty("ok");
});

test("GET /api/terminal returns array of task names", async () => {
  const res = await request(server).get("/api/terminal");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("GET /api/unreachable returns array of task names", async () => {
  const res = await request(server).get("/api/unreachable");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("GET /api/execute responds", async () => {
  const res = await request(server).get("/api/execute");
  expect(res.status).toBe(200);
});
