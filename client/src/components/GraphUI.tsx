import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
  type Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import { Dependency, Task } from "../types";
import { useCallback, useEffect, useState } from "react";
import {
  useDeleteTask,
  useDeleteDependency,
  useAddDependency,
  useUpdateTask,
} from "../hooks/useTasks";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { analyze } from "../api/tasks";

type ReadyWhen =
  | { kind: "exit" }
  | { kind: "port"; port: number }
  | { kind: "log"; match: string };

export function toReactFlowGraphFromLevels(
  levels: Task[][],
  deps: Dependency[],
) {
  const horizontalSpacing = 400;
  const verticalSpacing = 160;

  const nodes: Node[] = [];

  levels.forEach((levelTasks, levelIndex) => {
    const totalHeight = levelTasks.length * verticalSpacing;
    const startY = -totalHeight / 2;

    levelTasks.forEach((task, i) => {
      nodes.push({
        id: task.id,
        type: "default",
        position: {
          x: levelIndex * horizontalSpacing,
          y: startY + i * verticalSpacing,
        },
        data: {
          label: (
            <div className="text-left">
              <div className="font-semibold text-slate-800">{task.task}</div>
              <div className="text-xs text-slate-500">{task.folder}</div>

              {task.type === "service" && (
                <div className="text-[10px] mt-1 px-2 py-0.5 inline-block bg-blue-100 text-blue-600 rounded">
                  service
                </div>
              )}

              {task.command && (
                <div className="text-xs text-slate-400 mt-1 truncate">
                  {task.command}
                </div>
              )}
            </div>
          ),
        },
        style: {
          border: "2px solid #2563eb",
          borderRadius: "10px",
          background: "#ffffff",
          padding: "10px",
          width: 240,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        },
      });
    });
  });

  const edges: Edge[] = deps.map((d) => ({
    id: `${d.from}->${d.to}`,
    source: d.from,
    target: d.to,
    type: "bezier", // curved
    animated: true, // optional but looks good
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#2563eb",
    },
    style: {
      stroke: "#2563eb",
      strokeWidth: 2,
    },
  }));

  return { nodes, edges };
}
export function DependencyGraph({
  apiData,
}: {
  apiData: { tasks: Task[]; dependencies: Dependency[] };
}) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [taskName, setTaskName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [command, setCommand] = useState("");

  const [taskType, setTaskType] = useState<"job" | "service">("job");
  const [readyKind, setReadyKind] = useState<"exit" | "port" | "log">("exit");
  const [readyPort, setReadyPort] = useState<number>(3000);
  const [readyLogMatch, setReadyLogMatch] = useState("");
  const [levels, setLevels] = useState<Task[][]>([]);

  useEffect(() => {
    analyze("parallel").then((res) => {
      if (res.ok) {
        setLevels(res.levels);
      }
    });
  }, [apiData.tasks, apiData.dependencies]);
  const deleteTaskMutation = useDeleteTask();
  const deleteDependencyMutation = useDeleteDependency();
  const addDependencyMutation = useAddDependency();
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    const { nodes, edges } = toReactFlowGraphFromLevels(
      levels,
      apiData.dependencies,
    );
    setNodes(nodes);
    setEdges(edges);
  }, [levels, apiData.dependencies]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      deletedNodes.forEach((node) => {
        deleteTaskMutation.mutate(node.id);
      });
    },
    [deleteTaskMutation],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      deletedEdges.forEach((edge) => {
        deleteDependencyMutation.mutate({
          from: edge.source,
          to: edge.target,
        });
      });
    },
    [deleteDependencyMutation],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      addDependencyMutation.mutate({
        from: params.source,
        to: params.target,
      });
    },
    [addDependencyMutation],
  );

  const onNodeDoubleClick = useCallback(
    (_: any, node: Node) => {
      const task = apiData.tasks.find((t) => t.id === node.id);
      if (!task) return;

      setEditingTask(task);
      setTaskName(task.task);
      setFolderName(task.folder);
      setCommand(task.command ?? "");
      setTaskType(task.type);

      if (task.ready) {
        setReadyKind(task.ready.kind);

        if (task.ready.kind === "port") {
          setReadyPort(task.ready.port);
        }

        if (task.ready.kind === "log") {
          setReadyLogMatch(String(task.ready.match));
        }
      } else {
        setReadyKind("exit");
      }
    },
    [apiData.tasks],
  );

  const handleUpdateTask = () => {
    if (!editingTask) return;

    let ready: ReadyWhen | undefined = undefined;

    if (taskType === "service") {
      if (readyKind === "exit") {
        ready = { kind: "exit" };
      }

      if (readyKind === "port") {
        ready = { kind: "port", port: readyPort };
      }

      if (readyKind === "log") {
        ready = { kind: "log", match: readyLogMatch };
      }
    }

    updateTaskMutation.mutate({
      id: editingTask.id,
      updates: {
        task: taskName,
        folder: folderName,
        command,
        type: taskType,
        ready,
      },
    });

    setEditingTask(null);
  };

  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
          onConnect={onConnect}
          fitView
          nodesDraggable
          elementsSelectable
          nodesConnectable
          deleteKeyCode={["Backspace", "Delete"]}
          panOnScroll
          zoomOnScroll
          defaultEdgeOptions={{ type: "bezier" }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-[450px] shadow-2xl">
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
              <CardDescription>Update task configuration</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task name"
              />

              <input
                className="w-full border p-2 rounded"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder"
              />

              <textarea
                className="w-full border p-2 rounded resize-none"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Command"
                rows={3}
              />

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Task Type
                </label>
                <select
                  className="w-full border p-2 rounded"
                  value={taskType}
                  onChange={(e) =>
                    setTaskType(e.target.value as "job" | "service")
                  }
                >
                  <option value="job">Job</option>
                  <option value="service">Service</option>
                </select>
              </div>

              {/* Ready Section */}
              {taskType === "service" && (
                <div className="space-y-3 border rounded p-3 ">
                  <label className="block text-sm font-medium">
                    Ready When
                  </label>

                  <select
                    className="w-full border p-2 rounded"
                    value={readyKind}
                    onChange={(e) =>
                      setReadyKind(e.target.value as "exit" | "port" | "log")
                    }
                  >
                    <option value="exit">Process exits</option>
                    <option value="port">Port is open</option>
                    <option value="log">Log contains text</option>
                  </select>

                  {readyKind === "port" && (
                    <input
                      type="number"
                      className="w-full border p-2 rounded"
                      value={readyPort}
                      onChange={(e) => setReadyPort(Number(e.target.value))}
                      placeholder="Port number"
                    />
                  )}

                  {readyKind === "log" && (
                    <input
                      className="w-full border p-2 rounded"
                      value={readyLogMatch}
                      onChange={(e) => setReadyLogMatch(e.target.value)}
                      placeholder="Log match text"
                    />
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>

                <Button
                  onClick={handleUpdateTask}
                  disabled={updateTaskMutation.isPending}
                >
                  {updateTaskMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
