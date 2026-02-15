import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/tasks";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: api.fetchTasks,
  });
}

export function useAddTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.addTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useAddDependency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ from, to }: { from: string; to: string }) =>
      api.addDependency(from, to),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}