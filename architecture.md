# Orchestra Architecture

## 1) System Overview

Orchestra is a two-tier web application for modeling and running task dependency workflows:

- **Client**: React + TypeScript + Vite SPA (port `6080`)
- **Server**: Express + TypeScript on Bun runtime (port `5601`)

The core domain is a **workflow DAG** (Directed Acyclic Graph):
- nodes = tasks
- directed edges = dependencies (`from -> to`, meaning `to` waits for `from`)

---

## 2) High-Level Architecture

```text
+-------------------------------+            HTTP / SSE            +--------------------------------+
| Client (React + Vite)         | <-----------------------------> | Server (Express on Bun)        |
|                               |                                  |                                |
| - Pages (/tasks, /analysis,   |   REST: CRUD + graph analysis   | - API routes (/api/*)          |
|   /execution, /report)        |   SSE: /api/execute stream      | - Graph services               |
| - TanStack Query (server data)|                                  | - Execution service            |
| - Zustand (UI/workflow state) |                                  | - In-memory store              |
+-------------------------------+                                  +--------------------------------+
```

---

## 3) Client Architecture

### 3.1 Composition

- `src/main.tsx`: boots app with:
  - `BrowserRouter`
  - `QueryClientProvider`
- `src/App.tsx`: route table
  - `/` Home
  - `/tasks` workflow editor
  - `/analysis` graph analysis
  - `/execution` runtime terminal/graph view
  - `/report` placeholder report page

### 3.2 State Model

The client uses two complementary state layers:

1. **Server state** (network data): TanStack Query
   - tasks/dependencies fetch
   - mutations for add/update/delete operations
   - periodic polling for system stats and logs

2. **UI and local app state**: Zustand + local reducers
   - workflow metadata (`workflowName`) persisted in storage
   - step metrics counters
   - terminal UI state reducer for SSE events

### 3.3 API Access

- Axios instance points to `http://localhost:5601/api`.
- `src/api/tasks.ts` centralizes API methods:
  - task/dependency CRUD
  - analysis queries
  - execution controls
  - YAML import/export
  - logs + system stats

### 3.4 Execution Streaming in UI

- `useTerminals` opens `EventSource` to `/api/execute`.
- Incoming events are reduced into terminal UI state.
- Task state events patch Query cache so task cards update live.
- Stream event types include:
  - `terminal_open`
  - `task_started`
  - `task_stdout`
  - `task_stderr`
  - `task_state`
  - `task_finished`

---

## 4) Server Architecture

### 4.1 Entry and HTTP Pipeline

- `server/index.ts`: starts Express app on port `5601`
- `src/app.ts` middleware stack:
  - CORS allow origin `http://localhost:6080`
  - JSON body parsing
  - route mount at `/api`

### 4.2 In-Memory Domain Store

`src/store/index.ts` holds process-level mutable state:

- `tasks: Task[]`
- `dependencies: Dependency[]`
- `runningProcesses: Map<taskId, ChildProcess>`
- `taskLogs: Map<taskId, string[]>`
- `terminal: Map<taskId, { terminalId, taken }>`

This means all workflow data is ephemeral and resets on server restart.

### 4.3 API Layer

`src/api/index.ts` exposes endpoints grouped by concern:

- **Task management**: create/update/delete/list tasks
- **Dependency management**: add/remove dependency edges
- **Graph analysis**: order/cycle/path/parallel/terminal/unreachable
- **Execution control**: start SSE execution, stop all, stop one task
- **Workflow I/O**: upload YAML, export YAML
- **Observability**: task logs and system stats

### 4.4 Graph Services

`src/services/graph.ts` implements core graph algorithms:

- Topological sort (dependency resolution)
- DFS cycle detection
- BFS shortest path
- Parallel levels via Kahn-style indegree processing
- Terminal node detection
- Unreachable node detection

### 4.5 Execution Engine

Execution is orchestrated by `src/services/execution.ts` + `src/lib/process.ts`:

1. Validate workflow is acyclic
2. Build parallel levels
3. For each level, run tasks whose dependencies are satisfied
4. Spawn processes with `child_process.spawn` (`shell: true`, `detached: true`)
5. Stream stdout/stderr and state transitions over SSE
6. Track running children for stop operations

Task readiness rules:
- **job** task is considered ready when exit code is successful
- **service** task can become ready by:
  - process exit (`kind: exit`)
  - listening port (`kind: port`)
  - log pattern match (`kind: log`)

---

## 5) Workflow Data Model

## Task

A task contains:
- `id`
- `task` (display/name)
- `command`
- `folder` (working directory)
- `dependency: string[]` (parent task IDs)
- `type: "job" | "service"`
- `state`: idle/starting/ready/running/completed/failed/stopped
- optional `ready` strategy

## Dependency

A dependency edge:
- `from`: prerequisite task ID
- `to`: dependent task ID

---

## 6) YAML Import/Export Architecture

`src/services/parser.ts` maps between runtime workflow and a portable DAG format:

- `yaml -> dag -> { tasks, dependencies }`
- `{ tasks, dependencies } -> dag -> yaml`

Design details:
- Task names are normalized for DAG keys.
- Service readiness settings are serialized/deserialized.
- YAML upload replaces current in-memory workflow.

---

## 7) Runtime Flows

### 7.1 Authoring Flow

1. User creates/edits tasks in `/tasks`
2. Client calls REST mutations
3. Server updates in-memory arrays/maps
4. Query invalidation refreshes workflow graph

### 7.2 Analysis Flow

1. User requests analysis in `/analysis`
2. Client calls corresponding `/api/*` graph endpoint
3. Server computes on current in-memory graph
4. Result returned synchronously as JSON

### 7.3 Execution Flow

1. `/execution` subscribes to SSE `/api/execute`
2. Server starts scheduler + process spawning
3. Server streams task lifecycle/output events
4. Client updates terminal panes + task state visuals
5. Optional stop endpoints terminate child process groups

---

## 8) Architectural Strengths

- Clear client/server separation
- Centralized graph logic in dedicated service module
- Real-time execution visibility via SSE
- Support for both batch jobs and long-running services
- Portable workflow format via YAML import/export

---

## 9) Current Constraints

- Persistence is in-memory only (no database)
- Single-server process is source of truth
- SSE connection is currently hardcoded to local server URL
- OpenAPI spec exists but does not fully match all current runtime details/ports
- Report page is present but not fully implemented

---

## 10) Evolution Path (Suggested)

- Introduce persistent storage (SQLite/Postgres)
- Add workflow versioning/history
- Add auth/multi-user isolation
- Externalize config (API URL, CORS, ports) via environment
- Align and enforce OpenAPI contracts against implementation
- Add queue/backpressure controls for very large DAGs
