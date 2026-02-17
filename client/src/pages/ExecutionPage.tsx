import Terminal from "../components/Terminal";
import { useTerminals } from "../hooks/useTerminals";

const ExecutionPage = () => {
  const terminals = useTerminals();

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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