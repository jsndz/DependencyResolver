import { useRef, useState } from "react";
import { Plus, Trash2, ListTodo, Loader2, Link } from "lucide-react";
import { Task, TaskRequest } from "../types";
import { useAddDependency, useAddTask, useDeleteTask } from "../hooks/useTasks";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "./lib/utils";

export default function TaskManager({ onLink }: { onLink: () => void }) {
  const addDep = useAddDependency();

  const [taskName, setTaskName] = useState("");
  const [taskFolder, setTaskFolder] = useState("");
  const [taskCommand, setTaskCommand] = useState("");

  const addTask = useAddTask();
  const deleteTask = useDeleteTask();
  const [lastTaskId, setLastTaskId] = useState<string | null>(null);
  const [newFlow, setNewflow] = useState<boolean>(true);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    const task: TaskRequest = {
      task: taskName,
      command: taskCommand,
      folder: taskFolder,
    };

    addTask.mutate(task, {
      onSuccess: (newTask) => {
        if (lastTaskId) {
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
    <Card className="p-6 space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Step name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <Input
          placeholder="Working directory (e.g. /home/jaison/Pictures)"
          value={taskFolder}
          onChange={(e) => setTaskFolder(e.target.value)}
        />

        <Input
          placeholder="Command to run"
          value={taskCommand}
          onChange={(e) => setTaskCommand(e.target.value)}
        />

        <Button type="submit" className="w-full" disabled={addTask.isPending}>
          {addTask.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant={newFlow ? "link" : "secondary"}
          className="flex-1"
          onClick={() => {
            setNewflow(true);
            setLastTaskId(null);
            setTaskFolder("");
          }}
        >
          <ListTodo className="h-4 w-4 mr-2" />
          New Workflow
        </Button>

        <Button variant="secondary" className="flex-1" onClick={onLink}>
          <Link className="h-4 w-4 mr-2" />
          Link Workflow
        </Button>
      </div>
    </Card>
  );
}
