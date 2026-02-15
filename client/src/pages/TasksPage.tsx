import TaskManager from "../components/TaskManager";
import DependencyForm from "../components/DependencyForm";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
  const { data, isLoading } = useTasks();
  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      <TaskManager tasks={tasks} loading={isLoading} />
      <DependencyForm tasks={tasks} dependencies={dependencies} />
    </div>
  );
}
