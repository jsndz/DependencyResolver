import { useState } from "react";
import { Plus, ListTodo, Link, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { useAddTask, useAddDependency } from "../hooks/useTasks";
import { TaskRequest } from "../types";
import DependencyForm from "./DependencyForm";

export default function WorkflowControls({ tasks, dependencies }: any) {
  const addTask = useAddTask();
  const addDep = useAddDependency();

  const [mode, setMode] = useState<"none" | "add" | "new" | "link">("none");
  const [newFlow, setNewflow] = useState<boolean>(true);
  const [taskName, setTaskName] = useState("");
  const [taskFolder, setTaskFolder] = useState("");
  const [taskCommand, setTaskCommand] = useState("");
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);

  const handleAddTask = (isNewWorkflow: boolean) => {
    if (!taskName.trim()) return;

    const task: TaskRequest = {
      task: taskName,
      folder: taskFolder,
      command: taskCommand,
    };

    addTask.mutate(task, {
      onSuccess: (newTask) => {
        if (!isNewWorkflow && lastTaskId) {
          addDep.mutate({
            from: lastTaskId,
            to: newTask.id,
          });
        }

        setLastTaskId(newTask.id);
      },
    });

    setTaskName("");
    setTaskCommand("");
    setNewflow(false);
  };

  return (
   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
  <div className="relative flex flex-col items-center">

    {/* Popup ABOVE */}
    {(mode === "add" || mode === "new") && (
      <Card className="absolute bottom-full mb-4 w-80 p-4 space-y-3 shadow-xl">
        <Button variant="ghost" size="sm" onClick={() => setMode("none")}>
          ← Back
        </Button>

        <Input
          placeholder="Step name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <Input
          placeholder="Working directory"
          value={taskFolder}
          onChange={(e) => setTaskFolder(e.target.value)}
        />

        <Input
          placeholder="Command"
          value={taskCommand}
          onChange={(e) => setTaskCommand(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={() => handleAddTask(mode === "new")}
          disabled={addTask.isPending}
        >
          {addTask.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </>
          )}
        </Button>
      </Card>
    )}

    {mode === "link" && (
      <Card className="absolute bottom-full mb-4 w-96 shadow-xl">
        <DependencyForm
          tasks={tasks}
          dependencies={dependencies}
          onBack={() => setMode("none")}
        />
      </Card>
    )}

    {/* Buttons */}
    <div className="flex gap-2">
      <Button onClick={() => setMode("add")}>
        <Plus className="h-4 w-4 mr-2" />
        Add Step
      </Button>

      <Button
        onClick={() => {
          setLastTaskId(null);
          setMode("new");
          setNewflow(true);
        }}
        variant={newFlow ? "link" : "secondary"}
      >
        <ListTodo className="h-4 w-4 mr-2" />
        New Workflow
      </Button>

      <Button variant="outline" onClick={() => setMode("link")}>
        <Link className="h-4 w-4 mr-2" />
        Link Workflow
      </Button>
    </div>

  </div>
</div>

  );
}
