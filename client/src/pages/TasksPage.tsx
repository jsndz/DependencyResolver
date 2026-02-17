import TaskManager from "../components/TaskManager";
import { useTasks } from "../hooks/useTasks";
import { DependencyGraph } from "../components/GraphUI";
import { Card } from "../components/ui/card";

import { useState } from "react";
import DependencyForm from "../components/DependencyForm";

export default function TasksPage() {
  const { data } = useTasks();
  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];

  const [mode, setMode] = useState<"tasks" | "dependencies">("tasks");

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left panel */}
      <Card className="p-6 overflow-auto">
        {mode === "tasks" ? (
          <TaskManager onLink={() => setMode("dependencies")} />
        ) : (
          <DependencyForm
            tasks={tasks}
            dependencies={dependencies}
            onBack={() => setMode("tasks")}
          />
        )}
      </Card>

      {/* Right panel */}
      <Card className="p-6 overflow-hidden">
        <DependencyGraph apiData={{ tasks, dependencies }} />
      </Card>
    </div>
  );
}

