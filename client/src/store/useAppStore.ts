import { create } from "zustand";
import { persist } from "zustand/middleware";

type WorkflowState = {
  workflowName: string;
  setWorkflowName: (name: string) => void;
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set) => ({
      workflowName: "temp-workflow",
      setWorkflowName: (name) => set({ workflowName: name }),
    }),
    { name: "workflow-meta" }
  )
);