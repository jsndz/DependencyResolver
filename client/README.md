# Workflow Dependency Engine

A production-quality frontend application for visualizing and analyzing graph-based workflow dependencies, similar to CI/CD pipelines.

## Features

### Task Management
- Add and delete tasks
- Visual task list with card-based UI
- Real-time updates

### Dependency Builder
- Define dependencies between tasks using intuitive dropdowns
- Visual representation of task relationships (A → B)
- Dependency list with clear formatting

### Analysis Tools
The app provides six powerful analysis features:

1. **Resolve Execution Order** - Determines the valid execution sequence for all tasks
2. **Detect Cycle** - Identifies circular dependencies in the workflow
3. **Parallel Execution Plan** - Groups tasks by execution levels that can run in parallel
4. **Find Shortest Path** - Calculates the shortest dependency path between two tasks
5. **Show Terminal Tasks** - Lists final tasks with no outgoing dependencies
6. **Show Unreachable Tasks** - Identifies orphan tasks not connected to the workflow

### Visual Results
- Color-coded results (green = success, red = error, yellow = warning, blue = info)
- Numbered execution steps
- Parallel execution levels
- Highlighted cycle detection
- Arrow-separated path visualization
- Loading and error states

## Tech Stack

- **React** - Functional components with hooks
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library
- **Fetch API** - Backend communication

## Getting Started

### Prerequisites
Ensure the backend server is running at `http://localhost:3000`

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## API Integration

The app connects to these backend endpoints:

- `GET /tasks` - Fetch all tasks and dependencies
- `POST /task` - Add a new task
- `DELETE /task/:id` - Delete a task
- `POST /dependency` - Add a dependency
- `GET /order` - Get execution order
- `GET /cycle` - Check for cycles
- `GET /parallel` - Get parallel execution plan
- `GET /path?from=&to=` - Find shortest path
- `GET /terminal` - Get terminal tasks
- `GET /unreachable` - Get unreachable tasks

## Project Structure

```
src/
├── components/
│   ├── TaskManager.tsx      - Task creation and list
│   ├── DependencyForm.tsx   - Dependency management
│   ├── AnalysisPanel.tsx    - Analysis tool buttons
│   └── ResultViewer.tsx     - Result visualization
├── types/
│   └── index.ts             - TypeScript interfaces
├── config/
│   └── api.ts               - API configuration
└── App.tsx                  - Main application component
```

## Design Principles

- Clean, modern UI with soft gradients
- Responsive layout (desktop/tablet/mobile)
- Clear visual hierarchy
- Semantic color usage
- Intuitive user experience
- Production-ready code quality
