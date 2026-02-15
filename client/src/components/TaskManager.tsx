import { useState } from "react";
import { Plus, Trash2, ListTodo, Loader2 } from "lucide-react";
import { Task } from "../types";
import { useAddTask, useDeleteTask } from "../hooks/useTasks";

export default function TaskManager({
  tasks,
  loading,
}: {
  tasks: Task[];
  loading: boolean;
}) {
  const [taskName, setTaskName] = useState("");
  const addTask = useAddTask();
  const deleteTask = useDeleteTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    addTask.mutate(taskName.trim());
    setTaskName("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
            <ListTodo size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Task Management</h2>
            <p className="text-xs text-slate-500">Add and remove workflow tasks</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow"
            placeholder="Enter task name"
            disabled={addTask.isPending}
          />
          <button
            type="submit"
            disabled={!taskName.trim() || addTask.isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {addTask.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            Add
          </button>
        </form>

        <div>
          <h3 className="text-sm font-medium text-slate-600 mb-3">Tasks ({tasks.length})</h3>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
              <ListTodo size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm text-slate-500">No tasks yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Add a task above to get started</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-800 truncate">{t.task}</span>
                  <button
                    type="button"
                    onClick={() => deleteTask.mutate(t.id)}
                    disabled={deleteTask.isPending}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
