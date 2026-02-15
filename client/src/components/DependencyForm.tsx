import { useState } from "react";
import { ArrowRight, Link2, Plus, Loader2 } from "lucide-react";
import { Task, Dependency } from "../types";
import { useAddDependency } from "../hooks/useTasks";

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

  const name = (id: string) =>
    tasks.find((t) => t.id === id)?.task ?? id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
            <Link2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Dependencies</h2>
            <p className="text-xs text-slate-500">Define task order (from → to)</p>
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
                <option key={t.id} value={t.id}>{t.task}</option>
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
                <option key={t.id} value={t.id}>{t.task}</option>
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
          <h3 className="text-sm font-medium text-slate-600 mb-3">Current dependencies ({dependencies.length})</h3>
          {dependencies.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
              <Link2 size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No dependencies defined</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {dependencies.map((d, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm"
                >
                  <span className="font-medium text-slate-800">{name(d.from)}</span>
                  <ArrowRight size={16} className="text-slate-400 flex-shrink-0" />
                  <span className="font-medium text-slate-800">{name(d.to)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
