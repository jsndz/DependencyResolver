import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";

import { Dependency, Task } from "../types";
import { useEffect, useState } from "react";
import { analyze } from "../api/tasks";

function toReactFlowGraphFromLevels(
  levels: Task[][],
  deps: Dependency[],
  selectedId: string | null,
) {
  const horizontalSpacing = 400;
  const verticalSpacing = 160;

  const nodes: Node[] = [];

  levels.forEach((levelTasks, levelIndex) => {
    const totalHeight = levelTasks.length * verticalSpacing;
    const startY = -totalHeight / 2;

    levelTasks.forEach((task, i) => {
      const isSelected = task.id === selectedId;

      nodes.push({
        id: task.id,
        position: {
          x: levelIndex * horizontalSpacing,
          y: startY + i * verticalSpacing,
        },
        data: {
          label: (
            <div>
              <div className="font-semibold">{task.task}</div>
              <div className="text-xs text-muted-foreground">{task.folder}</div>
            </div>
          ),
        },
        style: {
          border: isSelected ? "3px solid #22c55e" : "2px solid #2563eb",
          borderRadius: "10px",
          background: "#ffffff",
          padding: "10px",
          width: 240,
          boxShadow: isSelected
            ? "0 0 0 4px rgba(34,197,94,0.2)"
            : "0 4px 10px rgba(0,0,0,0.08)",
        },
      });
    });
  });

  const edges: Edge[] = deps.map((d) => ({
    id: `${d.from}->${d.to}`,
    source: d.from,
    target: d.to,
    type: "bezier",
    animated: true,
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

export function ExecGraph({
  apiData,
  selectedId,
  onNodeClick,
}: {
  apiData: { tasks: Task[]; dependencies: Dependency[] };
  selectedId: string | null;
  onNodeClick: (id: string) => void;
}) {
  const [levels, setLevels] = useState<Task[][]>([]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  useEffect(() => {
    analyze("parallel").then((res) => {
      if (res.ok) {
        setLevels(res.levels);
      }
    });
  }, [apiData.tasks, apiData.dependencies]);
  useEffect(() => {
    const { nodes, edges } = toReactFlowGraphFromLevels(
      levels,
      apiData.dependencies,
      selectedId,
    );

    setNodes(nodes);
    setEdges(edges);
  }, [apiData.tasks, apiData.dependencies, selectedId]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        onNodeClick={(_, node) => onNodeClick(node.id)}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
