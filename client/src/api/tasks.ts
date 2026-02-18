import { api } from "../config/api";
import { Task, Dependency, TaskRequest } from "../types";

export const fetchTasks = async (): Promise<{
  tasks: Task[];
  dependencies: Dependency[];
}> => {
  const { data } = await api.get("/tasks");
  console.log("task and dep \n",data);

  return data;
};

export const addTask = async (task: TaskRequest) => {
  const { data } = await api.post("/task", task);
  console.log("added task\n",data);
  
  return data;
};

export const deleteTask = (id: string) => api.delete(`/task/${id}`);

export const addDependency = (from: string, to: string) =>
  api.post("/dependency", { from, to });

export const analyze = async (
  type: string,
  params?: { from?: string; to?: string },
) => {
  const { data } =
    type === "path"
      ? await api.get(`/${type}`, { params })
      : await api.get(`/${type}`);

  return data;
};

export const execute = async () => {
  const { data } = await api.get("/execute");

  return data;
};

export const uploadYaml = async (file: File) => {
  const text = await file.text();
  const { data } = await api.post("/yaml", { yaml: text });
  return data;
};

export const downloadYaml = async (workflowName: string) => {
  const encoded = encodeURIComponent(workflowName);
  const resp = await api.get(`/yaml/${encoded}`, {
    responseType: "blob",
    headers: { Accept: "application/x-yaml" },
  });

  const blob = new Blob([resp.data], { type: "application/x-yaml" });

  const disposition = resp.headers?.["content-disposition"] || resp.headers?.["Content-Disposition"];
  let filename = `${workflowName}.yaml`;
  if (disposition) {
    const match = /filename="?([^";]+)"?/.exec(disposition);
    if (match) filename = match[1];
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
