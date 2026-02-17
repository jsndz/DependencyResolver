type TerminalCardProps = {
    terminalId: string;
    lines: string[];
    status: "running" | "success" | "failed";
    name:string;
  };
  
  const statusColor = {
    running: "bg-yellow-400",
    success: "bg-green-400",
    failed: "bg-red-400",
  };
  
  const Terminal = ({ terminalId, lines, status,name }: TerminalCardProps) => {
    return (
      <div className="flex flex-col rounded-lg overflow-hidden shadow-lg bg-black border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-800 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusColor[status]}`} />
            <span>{name}</span>
          </div>
          <span className="uppercase">{status}</span>
        </div>
  
        {/* Body */}
        <div className="flex-1 p-3 overflow-y-auto font-mono text-sm text-zinc-100 whitespace-pre-wrap">
          {lines.length === 0 ? (
            <span className="text-zinc-500">Waiting for output…</span>
          ) : (
            lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default Terminal;