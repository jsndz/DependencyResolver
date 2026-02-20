import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { downloadYaml, stopExecution } from "../api/tasks";
import Terminal from "../components/Terminal";
import { Button } from "../components/ui/button";
import { useTerminals } from "../hooks/useTerminals";

export const ExecutionPage = () => {
  const { state, registerTerminal } = useTerminals();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"idle" | "loading" | "stopped">("idle");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleStop = async () => {
    if (status !== "idle") return;

    try {
      setStatus("loading");
      const result = await stopExecution();

      if (result?.ok) {
        setStatus("stopped");
      } else {
        setStatus("idle");
      }
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  const getButtonText = () => {
    if (status === "loading") return "Stopping...";
    if (status === "stopped") return "Stopped";
    return "Stop";
  };

  const handleDownload = async () => {
    if (!workflowName) return;

    try {
      setIsDownloading(true);
      await downloadYaml(workflowName);
      setIsDialogOpen(false);
      setWorkflowName("");
    } catch (err) {
      console.error(err);
      alert("Failed to download YAML");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 p-4 text-white">
      <div className="w-full flex justify-between items-center">
        <a
          href="#"
          className="mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal"
        >
          <img src="/logo.png" alt="logo" width={200} height={220} />
        </a>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Tasks
          </Button>

          <Button
            onClick={handleStop}
            disabled={status === "loading" || status === "stopped"}
            variant={status === "stopped" ? "secondary" : "destructive"}
          >
            {getButtonText()}
          </Button>

          <Button onClick={() => setIsDialogOpen(true)}>
            Create YAML
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Object.values(state).map((t) => (
          <Terminal
            key={t.terminalId}
            terminalId={t.terminalId}
            status={t.status}
            name={t.name!}
            register={registerTerminal}
          />
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl w-96 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">
              Download Workflow as YAML
            </h2>

            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="workflow-name"
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDialogOpen(false);
                  setWorkflowName("");
                }}
              >
                Cancel
              </Button>

              <Button
                disabled={!workflowName || isDownloading}
                onClick={handleDownload}
              >
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};