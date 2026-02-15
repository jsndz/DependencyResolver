# Workflow Dependency Engine

A web app to define tasks and their dependencies, then run graph-based analyses (topological order, cycle detection, path finding, and more).

## Features

- **Task management** — Add and delete tasks. Each task has a name and a unique ID.
- **Dependencies** — Define directed edges between tasks (from → to). Dependencies are stored and listed in the UI.
- **Resolve order** — Get a valid topological order for your task graph (or detect if none exists due to a cycle).
- **Detect cycle** — Check whether the dependency graph contains a cycle.
- **Parallel plan** — See tasks grouped by execution level (what can run in parallel at each step).
- **Terminal tasks** — List leaf nodes (tasks with no outgoing dependencies).
- **Unreachable tasks** — List tasks that are not reachable from any other task in the graph.
- **Find path** — Compute a shortest path between two chosen tasks.

Results are shown in a dedicated panel; array results (e.g. order, path) are displayed as a list, and other payloads as formatted JSON.

## Tech stack

| Layer   | Stack |
|--------|--------|
| **Client** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Axios, Lucide React |
| **Server** | Express 5, TypeScript, Bun (runtime) |

The backend keeps tasks and dependencies in memory (no database). CORS is set for `http://localhost:5173`.

## Project structure

```
dependencyresolver/
├── client/          # Vite + React frontend
│   └── src/
│       ├── api/     # API client (tasks, analysis)
│       ├── components/
│       ├── config/  # API base URL
│       ├── hooks/   # useTasks, useAnalysis
│       └── store/   # Zustand (analysis result, error)
├── server/          # Express API
│   └── src/
│       ├── routes.ts   # REST endpoints
│       ├── store.ts    # in-memory tasks & dependencies
│       └── graph.ts    # order, cycle, path, parallel, terminal, unreachable
└── README.md
```

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) (for the server)
- Node.js 18+ (for the client; or use Bun for `client` as well)

### Run the app

1. **Start the API server** (port 3000):

   ```bash
   cd server
   bun install
   bun run .
   ```

2. **Start the frontend** (port 5173):

   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open **http://localhost:5173** in your browser.

### Build for production

- **Client:** `cd client && npm run build` — output in `client/dist`.
- **Server:** Ensure the client build is served (e.g. via `express.static` or a reverse proxy). The repo already uses `express.static` for a `public` folder; you can point it at `client/dist` after building.

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks and dependencies |
| POST | `/api/task` | Add a task (`body: { task: string }`) |
| DELETE | `/api/task/:id` | Delete a task and its dependencies |
| POST | `/api/dependency` | Add a dependency (`body: { from, to }` task IDs) |
| GET | `/api/order` | Topological order (or cycle info) |
| GET | `/api/cycle` | Cycle detection result |
| GET | `/api/parallel` | Parallel execution levels |
| GET | `/api/terminal` | Terminal (leaf) tasks |
| GET | `/api/unreachable` | Unreachable tasks |
| GET | `/api/path?from=&to=` | Shortest path between two tasks |

## License

Private / unlicensed unless stated otherwise.
