import { useTasks } from "../hooks/useTasks";
import { DependencyGraph } from "../components/GraphUI";

import UploadYaml from "../components/UploadYaml";
import { Button } from "../components/ui/button";
import { NavLink } from "react-router-dom";
import { Play, BarChart3 } from "lucide-react";
import WorkflowControls from "../components/TaskManager";
import { useSystemStats } from "../hooks/useTasks";

export default function TasksPage() {
  const { data, refetch } = useTasks();
  const { data: systemStats } = useSystemStats();
  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-background w-full h-16 flex items-center justify-between px-4 border-b shrink-0">
        <div className="flex items-center">
          <a href="#" className="flex items-center">
            <img src="/logo.png" alt="logo" width={200} height={220} />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <UploadYaml onSuccess={refetch} />
          <Button>
            <NavLink to="/analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analysis
            </NavLink>
          </Button>
          <Button>
            <NavLink to="/execution" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Run Workflow
            </NavLink>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <DependencyGraph apiData={{ tasks, dependencies }} />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
          <WorkflowControls tasks={tasks} dependencies={dependencies} />
        </div>
      </div>
      
      <footer className="w-full h-8 bg-card border-t px-4 flex items-center justify-between text-xs text-muted-foreground shrink-0">
        {systemStats ? (
          <>
            <div className="flex items-center gap-4">
              <span>CPU: {systemStats.cpuCores} cores</span>
              <span>Load: {systemStats.loadAvg.map((l: number) => l.toFixed(2)).join(", ")}</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Memory: {((systemStats.usedMem / systemStats.totalMem) * 100).toFixed(1)}% used</span>
              <span>Platform: {systemStats.platform}</span>
            </div>
          </>
        ) : (
          <span>Loading system stats...</span>
        )}
      </footer>
    </div>
  );
}
