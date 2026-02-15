import { api } from "../config/api";
import { Task, Dependency, TaskRequest } from "../types";

export const fetchTasks = async (): Promise<{
  tasks: Task[];
  dependencies: Dependency[];
}> => {
  const { data } = await api.get("/tasks");
  console.log(data);
  
  return data;
};

export const addTask = (task: TaskRequest) =>
  api.post("/task", task);

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


export const execute  =async () =>{
  const { data } = await api.get("/execute");
  console.log(data);
  
  return data;
}