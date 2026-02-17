import ReactFlow, {
    Background,
    Controls,
    MarkerType,
    type Node,
    type Edge,
  } from "reactflow";
  import "reactflow/dist/style.css";
import { Dependency, Task } from "../types";
export function toReactFlowGraph(tasks: Task[], deps: Dependency[]) {
    const nodes: Node[] = tasks.map((task, index) => ({
      id: task.id,
      type: "default",
      data: {
        label: (
          <div className="text-left">
            <div className="font-semibold text-slate-800">{task.task}</div>
            <div className="text-xs text-slate-500">{task.folder}</div>
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
        width: 180,
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
  export  function DependencyGraph({
    apiData,
  }: {
    apiData: { tasks: Task[]; dependencies: Dependency[] };
  }) {
    const { nodes, edges } = toReactFlowGraph(
      apiData.tasks,
      apiData.dependencies
    );
  
    return (
      <div className="w-full h-full rounded-xl border border-slate-200 bg-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesConnectable={false}
          nodesDraggable={true}
          panOnScroll
          zoomOnScroll
        >
          <Background gap={18} size={1} />
          <Controls />
        </ReactFlow>
      </div>
    );
  }