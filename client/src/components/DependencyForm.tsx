import { useState } from "react";
import { ArrowRight, Link2, Plus, Loader2 } from "lucide-react";
import { useAddDependency } from "../hooks/useTasks";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Task, Dependency } from "../types";
export default function DependencyForm({
  tasks,
  dependencies,
}: {
  tasks: Task[];
  dependencies: Dependency[];
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const addDep = useAddDependency();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || from === to) return;
    addDep.mutate({ from, to });
    setFrom("");
    setTo("");
  };

  const name = (id: string) => tasks.find((t) => t.id === id)?.task ?? id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
            <Link2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Dependencies
            </h2>
            <p className="text-xs text-slate-500">
              Define task order (from → to)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 min-w-[140px] px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">From task</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.task}
                </option>
              ))}
            </select>
            <span className="flex-shrink-0 text-slate-400" aria-hidden>
              <ArrowRight size={20} />
            </span>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 min-w-[140px] px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">To task</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.task}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!from || !to || from === to || addDep.isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {addDep.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Add
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-3">
            Current dependencies ({dependencies.length})
          </h3>
          {dependencies.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
              <Link2 size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No dependencies defined</p>
            </div>
          ) : (
            <div>
              <div>
                <ul className="space-y-2">
                  {dependencies.map((d, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm"
                    >
                      <span className="font-medium text-slate-800">
                        {name(d.from)}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 flex-shrink-0"
                      />
                      <span className="font-medium text-slate-800">
                        {name(d.to)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <DependencyGraph apiData={{ tasks, dependencies }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      border: "2px solid #2563eb", // blue-600
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
    <div className="w-full h-[600px] rounded-xl border border-slate-200 bg-slate-50">
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