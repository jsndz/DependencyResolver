import Terminal from "../components/Terminal";
import { Button } from "../components/ui/button";
import { downloadYaml } from "../api/tasks";
import { useTerminals } from "../hooks/useTerminals";

const ExecutionPage = () => {
  const terminals = useTerminals();

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Button
            onClick={async () => {
              const name = window.prompt("Enter workflow name for YAML download:", "workflow");
              if (!name) return;
              try {
                await downloadYaml(name);
              } catch (err: any) {
                console.error(err);
                alert("Failed to download YAML: " + (err?.message ?? String(err)));
              }
            }}
          >
            Create Yaml
          </Button>
        </div>
        {Object.values(terminals).map((t) => (
          <Terminal
            name = {t.name!}
            key={t.terminalId}
            terminalId={t.terminalId}
            lines={t.lines}
            status={t.status}
          />
        ))}
      </div>
    </div>
  );
};

export default ExecutionPage;