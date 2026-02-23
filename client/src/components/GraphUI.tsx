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

export function toReactFlowGraph(tasks: Task[], deps: Dependency[]) {
  const nodes: Node[] = tasks.map((task, index) => ({
    id: task.id,
    type: "default",
    data: {
      label: (
        <div className="text-left">
          <div className="font-semibold text-slate-800">{task.task}</div>
          <div className="text-xs text-slate-500">{task.folder}</div>
          {task.command && (
            <div className="text-xs text-slate-400 mt-1 truncate">
              {task.command}
            </div>
          )}
        </div>
      ),
    },
    position: {
      x: 100,
      y: index * 120,
    },
    style: {
      border: "2px solid #2563eb",
      borderRadius: "10px",
      background: "#ffffff",
      padding: "10px",
      width: 220,
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    },
  }));

  const edges: Edge[] = deps.map((d) => ({
    id: `${d.from}->${d.to}`,
    source: d.from,
    target: d.to,
    type: "smoothstep",
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

  const deleteTaskMutation = useDeleteTask();
  const deleteDependencyMutation = useDeleteDependency();
  const addDependencyMutation = useAddDependency();
  const updateTaskMutation = useUpdateTask();

  useEffect(() => {
    const { nodes, edges } = toReactFlowGraph(
      apiData.tasks,
      apiData.dependencies
    );

    setNodes(nodes);
    setEdges(edges);
  }, [apiData.tasks, apiData.dependencies]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodesDelete = useCallback(
    (deletedNodes: Node[]) => {
      deletedNodes.forEach((node) => {
        deleteTaskMutation.mutate(node.id);
      });
    },
    [deleteTaskMutation]
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
    [deleteDependencyMutation]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      addDependencyMutation.mutate({
        from: params.source,
        to: params.target,
      });
    },
    [addDependencyMutation]
  );

  const onNodeDoubleClick = useCallback(
    (_: any, node: Node) => {
      const task = apiData.tasks.find((t) => t.id === node.id);
      if (!task) return;

      setEditingTask(task);
      setTaskName(task.task);
      setFolderName(task.folder);
      setCommand(task.command ?? "");
    },
    [apiData.tasks]
  );

  const handleUpdateTask = () => {
    if (!editingTask) return;

    updateTaskMutation.mutate({
      id: editingTask.id,
      updates: {
        task: taskName,
        folder: folderName,
        command: command,
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
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Card className="w-[420px] shadow-2xl">
            <CardHeader>
              <CardTitle>Edit Task</CardTitle>
              <CardDescription>
                Update task details and command
              </CardDescription>
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
                placeholder="Command (e.g. npm run build)"
                rows={3}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingTask(null)}
                >
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