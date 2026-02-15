import { Workflow } from "lucide-react";
import TaskManager from "./components/TaskManager";
import DependencyForm from "./components/DependencyForm";
import AnalysisPanel from "./components/AnalysisPanel";
import ResultViewer from "./components/ResultViewer";
import { useTasks } from "./hooks/useTasks";
import { useAppStore } from "./store/useAppStore";

function App() {
  const { data, isLoading } = useTasks();
  const { error } = useAppStore();

  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Workflow className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Workflow Dependency Engine</h1>
            <p className="text-sm text-gray-600">
              Visualize and analyze task dependencies
            </p>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TaskManager tasks={tasks} loading={isLoading} />
          <DependencyForm tasks={tasks} dependencies={dependencies} />
        </div>

        <div className="space-y-6">
          <AnalysisPanel tasks={tasks} />
          <ResultViewer tasks={tasks}/>
        </div>
      </main>
    </div>
  );
}

export default App;