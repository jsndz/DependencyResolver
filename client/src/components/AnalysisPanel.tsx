import { useState } from "react";
import { Play, AlertCircle, GitBranch, Flag, AlertTriangle, Route, Zap, Loader2, ArrowRight } from "lucide-react";
import { Task } from "../types";
import { useAnalysis } from "../hooks/useAnalysis";

const analyses = [
  { type: "order" as const, label: "Resolve Order", icon: Play, description: "Topological order" },
  { type: "cycle" as const, label: "Detect Cycle", icon: AlertCircle, description: "Find cycles" },
  { type: "parallel" as const, label: "Parallel Plan", icon: GitBranch, description: "Execution levels" },
  { type: "terminal" as const, label: "Terminal Tasks", icon: Flag, description: "Leaf nodes" },
  { type: "unreachable" as const, label: "Unreachable", icon: AlertTriangle, description: "Orphan tasks" },
];

export default function AnalysisPanel({ tasks }: { tasks: Task[] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const analyze = useAnalysis();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
            <Zap size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Analysis</h2>
            <p className="text-xs text-slate-500">Run checks on your dependency graph</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-3">Run analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analyses.map(({ type, label, icon: Icon, description }) => (
              <button
                key={type}
                type="button"
                onClick={() => analyze.mutate({ type })}
                disabled={analyze.isPending}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-white text-left hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors disabled:opacity-50"
              >
                <div className="p-1.5 rounded-md bg-slate-100 text-slate-600">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-slate-800 block">{label}</span>
                  <span className="text-xs text-slate-500">{description}</span>
                </div>
                {analyze.isPending && <Loader2 size={16} className="animate-spin text-slate-400 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Find path</h3>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 min-w-[120px] px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">From</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.task}</option>
              ))}
            </select>
            <ArrowIcon />
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 min-w-[120px] px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">To</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>{t.task}</option>
              ))}
            </select>
            <button
              type="button"
              disabled={!from || !to || from === to || analyze.isPending}
              onClick={() => analyze.mutate({ type: "path", from, to })}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Route size={18} />
              Find Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <span className="text-slate-400 flex-shrink-0" aria-hidden>
      <ArrowRight size={18} />
    </span>
  );
}
