import { api } from "../config/api";
import { Task, Dependency } from "../types";

export const fetchTasks = async (): Promise<{
  tasks: Task[];
  dependencies: Dependency[];
}> => {
  const { data } = await api.get("/tasks");
  return data;
};

export const addTask = (task: string) =>
  api.post("/task", { task });

export const deleteTask = (id: string) =>
  api.delete(`/task/${id}`);

export const addDependency = (from: string, to: string) =>
  api.post("/dependency", { from, to });

export const analyze = async (
  type: string,
  params?: { from?: string; to?: string }
) => {
  const { data } =
    type === "path"
      ? await api.get(`/${type}`, { params })
      : await api.get(`/${type}`);

  return data;
};