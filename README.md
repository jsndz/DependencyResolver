  # Orchestra

  Orchestra is a local workflow orchestration app for building, validating, and executing task DAGs (directed acyclic graphs).

  It includes:
  - a React + Vite client for task graph editing and execution monitoring
  - an Express + Bun server for dependency analysis and task execution

  ## Current Build Snapshot

  - Client dev URL: `http://localhost:6080`
  - Server API URL: `http://localhost:5601/api`
  - CORS origin: `http://localhost:6080`
  - Data store: in-memory (`tasks`, `dependencies`, `taskLogs`)

  ## Features

  - Create, edit, and delete workflow tasks
  - Add and remove task dependencies
  - Upload workflow from YAML
  - Export current workflow to YAML
  - Analyze graph structure:
    - topological order
    - cycle detection
    - parallel execution levels
    - terminal nodes
    - unreachable nodes
    - shortest path between tasks
  - Execute workflow with streaming logs
  - Stop full execution or individual running task
  - View system stats (CPU, load, memory, platform)

  ## Frontend Routes

  - `/` Home page
  - `/tasks` Workflow builder
  - `/analysis` Analysis dashboard
  - `/execution` Execution dashboard (terminal + graph/log views)
  - `/report` Report page (placeholder)

  ## Tech Stack

  ### Client
  - React 18
  - TypeScript
  - Vite 5
  - Tailwind CSS 4
  - TanStack Query
  - Zustand
  - Axios
  - React Router

  ### Server
  - Bun runtime
  - Express 5
  - TypeScript
  - YAML parser

  ## Project Structure

  ```text
  orchestra/
  ├── client/
  │   ├── src/
  │   │   ├── api/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── pages/
  │   │   ├── store/
  │   │   └── types/
  │   └── vite.config.ts
  ├── server/
  │   ├── src/
  │   │   ├── api/
  │   │   ├── services/
  │   │   ├── lib/
  │   │   ├── store/
  │   │   └── __tests__/
  │   └── index.ts
  └── README.md
  ```

  ## Prerequisites

  - Node.js 18+
  - Bun 1.x+

  ## Run Locally

  ### 1) Start server

  ```bash
  cd server
  bun install
  bun run index.ts
  ```

  Server starts on `http://localhost:5601`.

  ### 2) Start client

  ```bash
  cd client
  npm install
  npm run dev
  ```

  Client starts on `http://localhost:6080`.

  ## Scripts

  ### Client (`client/package.json`)

  - `npm run dev` — start Vite dev server
  - `npm run build` — production build
  - `npm run preview` — preview production build
  - `npm run lint` — run ESLint
  - `npm run typecheck` — TypeScript type check

  ### Server (`server/package.json`)

  - `bun test` — run server test suite

  ## API Reference

  Base URL: `http://localhost:5601/api`

  ### Tasks & Dependencies

  - `GET /tasks`
  - `POST /task`
  - `PUT /task/:id`
  - `DELETE /task/:id`
  - `POST /dependency`
  - `DELETE /dependency` (body: `{ from, to }`)

  ### Graph Analysis

  - `GET /order`
  - `GET /cycle`
  - `GET /parallel`
  - `GET /terminal`
  - `GET /unreachable`
  - `GET /path?from=<taskId>&to=<taskId>`

  ### Execution

  - `GET /execute` (SSE stream)
  - `GET /execution/stop`
  - `GET /task/:id/stop`
  - `GET /log/:taskId`

  ### Workflow Import/Export

  - `POST /yaml` (body: `{ yaml: string }`)
  - `GET /yaml/:workflow` (downloads YAML)

  ### System

  - `GET /system/stats`

  ## Notes

  - State resets on server restart because storage is in-memory.
  - The current report page exists but is not fully implemented yet.

  ## License

  Private / unlicensed unless stated otherwise.
