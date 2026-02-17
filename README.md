# 🎼 Orchestra

**Orchestra** is a general-purpose workflow builder that lets you define executable steps, describe how they relate to each other, and run them safely in the correct order with parallelism and live feedback.

It models workflows as **directed graphs**, but hides graph complexity behind a simple, intention-driven interface.

---

## 🚀 What Problem Does Orchestra Solve?

In real projects, steps rarely run in isolation:

- Some steps must run **before** others
- Some can run **in parallel**
- Some should **stop execution** if they fail
- Some steps are unreachable or incorrectly wired

Orchestra helps you:

- define steps and ordering rules
- validate workflows before execution
- understand _what will run and why_
- execute workflows locally with correctness guarantees

Think of it as **CI/CD-style orchestration for local development**, without YAML, cloud setup, or infrastructure.

---

## 🧠 Core Concept

- **Step** → an executable action (command + working folder)
- **Order rule** → one step must finish before another can start
- **Workflow** → a set of steps connected by order rules
- **Execution plan** → how the workflow will run (order + parallelism)

Graphs are an **internal implementation detail**, not a user concern.

---

## ✨ Features

### Step Definition

- Add and delete executable steps
- Each step has:
  - name
  - command
  - working directory

---

### Order Rules

- Define execution constraints between steps
- Expressed as:

  > “Step B can run only after Step A finishes”

---

### Workflow Validation

- Detect circular execution rules
- Identify unreachable steps
- List terminal (leaf) steps
- Validate workflows before execution

---

### Execution Planning

- Resolve a valid execution order
- Group steps that can run in parallel
- Preview the execution plan before running

---

### Workflow Execution

- Execute steps locally using the resolved plan
- Parallel execution where safe
- Failure isolation:
  - failed steps block only their dependents
  - independent branches continue running

- Live output streamed to the UI

---

### Path Analysis

- Compute the shortest path between two steps
- Useful for understanding indirect relationships and dependencies

---

## 🖥️ User Experience Highlights

- Users interact with **steps and goals**, not graphs
- Execution plans are shown **before** execution
- Live output is grouped logically by execution branch
- Errors are explained in plain language

---

## 🛠️ Tech Stack

| Layer      | Stack                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| **Client** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Axios, Lucide React |
| **Server** | Express 5, TypeScript, Bun runtime                                                     |

- Data is stored **in memory** (no database)
- Designed for **local execution and learning**
- CORS enabled for `http://localhost:5173`

---

## 📁 Project Structure

```
orchestra/
├── client/              # React frontend
│   └── src/
│       ├── api/         # API client
│       ├── components/
│       ├── config/      # API configuration
│       ├── hooks/       # Data & analysis hooks
│       └── store/       # Global UI state
├── server/              # Express backend
│   └── src/
│       ├── routes.ts    # REST endpoints
│       ├── store.ts     # In-memory state
│       └── graph.ts     # Graph algorithms & planning
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites

- **Bun** (for server runtime)
- **Node.js 18+** (for client)

---

### Run Locally

#### Start the server (port 3000)

```bash
cd server
bun install
bun run .
```

#### Start the frontend (port 5173)

```bash
cd client
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### Production Build

- **Client**

  ```bash
  cd client
  npm run build
  ```

  Output: `client/dist`

- **Server**
  Serve the client build using `express.static` or a reverse proxy.

---

## 🔌 API Overview

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET    | `/api/tasks`          | Get all steps and order rules |
| POST   | `/api/task`           | Add a step                    |
| DELETE | `/api/task/:id`       | Delete a step                 |
| POST   | `/api/dependency`     | Add an order rule             |
| GET    | `/api/order`          | Resolve execution order       |
| GET    | `/api/cycle`          | Detect circular rules         |
| GET    | `/api/parallel`       | Parallel execution plan       |
| GET    | `/api/terminal`       | Terminal (leaf) steps         |
| GET    | `/api/unreachable`    | Unreachable steps             |
| GET    | `/api/path?from=&to=` | Shortest path between steps   |

---

## 🎯 What Orchestra Is (and Is Not)

**Orchestra is:**

- a workflow planner
- a dependency resolver
- a local execution engine
- a learning tool for graph-based systems

**Orchestra is not:**

- a production CI/CD platform
- a cloud scheduler
- a graph visualizer
- a replacement for Airflow or Jenkins

---

## 📜 License

Private / unlicensed unless stated otherwise.

---
