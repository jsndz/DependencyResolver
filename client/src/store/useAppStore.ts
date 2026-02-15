import { create } from "zustand";

interface AppState {
  analysisType: string | null;
  analysisData: any;
  error: string | null;

  setAnalysis: (type: string | null, data: any) => void;
  setError: (err: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  analysisType: null,
  analysisData: null,
  error: null,

  setAnalysis: (type, data) =>
    set({ analysisType: type, analysisData: data }),

  setError: (error) => set({ error }),
}));