import Terminal from "../components/Terminal";

import { useTerminals } from "../hooks/useTerminals";

export const ExecutionPage = () => {
  const { state, registerTerminal } = useTerminals();

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
};
