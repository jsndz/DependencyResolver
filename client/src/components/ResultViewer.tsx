import { FileJson, List } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Task } from "../types";

export default function ResultViewer({ tasks }: { tasks: Task[] }) {
  const { analysisType, analysisData } = useAppStore();

  const name = (id: string) =>
    tasks.find((t) => t.id === id)?.task ?? id;

  if (!analysisType || analysisData == null) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
              <FileJson size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Results</h2>
              <p className="text-xs text-slate-500">Analysis output appears here</p>
            </div>
          </div>
        </div>
        <div className="p-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-300 mb-4">
            <List size={40} />
          </div>
          <p className="text-sm font-medium text-slate-600">No results yet</p>
          <p className="text-xs text-slate-500 mt-1">Run an analysis to see output</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
            <FileJson size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Results</h2>
            <p className="text-xs text-slate-500 capitalize">{analysisType.replace(/_/g, " ")}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {Array.isArray(analysisData) ? (
          <ul className="space-y-2">
            {analysisData.map((x, i) => (
              <li
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800"
              >
                <span className="text-slate-400 font-mono text-xs w-6">{i + 1}.</span>
                {typeof x === "string" ? name(x) : JSON.stringify(x)}
              </li>
            ))}
          </ul>
        ) : (
          <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono border border-slate-700">
            {JSON.stringify(analysisData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
