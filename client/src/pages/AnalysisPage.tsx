import AnalysisPanel from "../components/AnalysisPanel";
import ResultViewer from "../components/ResultViewer";
import { useTasks } from "../hooks/useTasks";

export default function AnalysisPage() {
  const { data } = useTasks();
  const tasks = data?.tasks ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <AnalysisPanel tasks={tasks} />
      <ResultViewer tasks={tasks} />
    </div>
  );
}
