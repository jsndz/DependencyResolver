import { useState } from "react";
import { TerminalPage } from "../components/TerminalView";
import LogPage from "../components/GraphView";
type ViewMode = "terminal" | "graph";
export default function ExecutionDashboard() {
  const [view, setView] = useState<ViewMode>("terminal");

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
  
      <div className={view === "terminal" ? "block h-full" : "hidden"}>
        <TerminalPage />
      </div>

      <div className={view === "graph" ? "block h-full" : "hidden"}>
        <LogPage />
      </div>

      {/* FLOATING SWITCHER */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-card border shadow-xl rounded-full px-2 py-2 flex gap-2">
          <button
            onClick={() => setView("terminal")}
            className={`px-4 py-1 rounded-full text-sm transition ${
              view === "terminal" ? "bg-primary text-white" : "hover:bg-muted"
            }`}
          >
            Terminal View
          </button>

          <button
            onClick={() => setView("graph")}
            className={`px-4 py-1 rounded-full text-sm transition ${
              view === "graph" ? "bg-primary text-white" : "hover:bg-muted"
            }`}
          >
            Graph View
          </button>
        </div>
      </div>
    </div>
  );
}