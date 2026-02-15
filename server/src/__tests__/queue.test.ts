import { test, expect } from "bun:test";
import { Queue } from "../lib/queue.js";

test("Queue starts empty", () => {
  const q = new Queue();
  expect(q.empty()).toBe(true);
  expect(q.front()).toBeUndefined();
});

test("Queue push and front", () => {
  const q = new Queue();
  q.push(1);
  expect(q.empty()).toBe(false);
  expect(q.front()).toBe(1);
  q.push(2);
  expect(q.front()).toBe(1);
});

test("Queue pop removes front", () => {
  const q = new Queue();
  q.push(1);
  q.push(2);
  q.pop();
  expect(q.front()).toBe(2);
  q.pop();
  expect(q.empty()).toBe(true);
  expect(q.front()).toBeUndefined();
});

test("Queue pop on empty does not throw", () => {
  const q = new Queue();
  expect(() => q.pop()).not.toThrow();
});

test("Queue FIFO order", () => {
  const q = new Queue();
  q.push(1);
  q.push(2);
  q.push(3);
  expect(q.front()).toBe(1);
  q.pop();
  expect(q.front()).toBe(2);
  q.pop();
  expect(q.front()).toBe(3);
  q.pop();
  expect(q.empty()).toBe(true);
});
