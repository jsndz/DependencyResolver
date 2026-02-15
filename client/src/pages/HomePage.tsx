import TaskManager from "../components/TaskManager";
import DependencyForm from "../components/DependencyForm";
import AnalysisPanel from "../components/AnalysisPanel";
import ResultViewer from "../components/ResultViewer";
import { useTasks } from "../hooks/useTasks";

export default function HomePage() {
  const { data, isLoading } = useTasks();
  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <TaskManager tasks={tasks} loading={isLoading} />
        <DependencyForm tasks={tasks} dependencies={dependencies} />
      </div>
      <div className="space-y-6">
        <AnalysisPanel tasks={tasks} />
        <ResultViewer tasks={tasks} />
      </div>
    </div>
  );
}
