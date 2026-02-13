Dependency Resolver

You are given a list of tasks and their dependencies.
Each task can run only after all its dependencies are completed.

Your system should:

Validate whether the dependencies are valid (no circular dependency)

If valid, return a correct execution order of tasks

If invalid, clearly report a circular dependency error

---

# Dependency & Workflow Engine — NEXT TODOs

## 1 Cycle Diagnostics

- Detect cycle
- Extract exact cycle path
- Show tasks involved in the cycle

---

## 2 Strongly Connected Components (SCC)

- Identify SCCs using Kosaraju
- Group mutually dependent tasks
- Build DAG of SCCs
- Output execution order of SCC groups

---

## 3 Critical Path Analysis

- Assign execution time to each task
- Compute longest path in DAG
- Output critical path
- Output total workflow time

---

## 4 Parallel Execution Levels

- Identify tasks runnable in parallel
- Group tasks by execution level
- Output step-wise execution plan

---

## 5 Unreachable / Redundant Tasks

- Detect tasks never executed
- Detect redundant dependencies
- Report unused tasks

---


## 6 Undirected Dependency Analysis (Optional)

- Treat dependencies as undirected
- Find connected components
- Detect redundant connections using DSU

---
