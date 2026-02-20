import { useTasks } from "../hooks/useTasks";
import { DependencyGraph } from "../components/GraphUI";

import UploadYaml from "../components/UploadYaml";
import { Button } from "../components/ui/button";
import { NavLink } from "react-router-dom";
import { Play } from "lucide-react";
import WorkflowControls from "../components/TaskManager";

export default function TasksPage() {
  const { data } = useTasks();
  const tasks = data?.tasks ?? [];
  const dependencies = data?.dependencies ?? [];



  return (
    <div className="relative">
      <div className="absolute z-20 top-0 left-0">
        <a
          href="#"
          className="  mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
        >
          <img src="/logo.png" alt="logo" width={200} height={220} />
        </a>
      </div>
      <div className="absolute z-20  top-0 right-0 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
        <UploadYaml></UploadYaml>
        <Button>
          {" "}
          <NavLink to="/analysis">Analysis</NavLink>
        </Button>
         <Button>
          {" "}
          <NavLink to="/execution"><Play></Play></NavLink>
        </Button>
      </div>
   
        <WorkflowControls tasks={tasks} dependencies={dependencies} />
   
      <div style={{ width: "100vw", height: "100vh" }}>
        <DependencyGraph apiData={{ tasks, dependencies }} />
      </div>
    </div>
  );
}

