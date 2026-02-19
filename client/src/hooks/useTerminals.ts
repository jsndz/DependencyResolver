import { useEffect, useReducer, useRef } from "react";
import { terminalsReducer } from "../config/handleSSE";
import { Events, TerminalUIState } from "../types";
import { Terminal as XTerm } from "@xterm/xterm";

export function useTerminals() {
  const [state, dispatch] = useReducer(
    terminalsReducer,
    {} as Record<string, TerminalUIState>,
  );

  const esRef = useRef<EventSource | null>(null);
  const terminalMap = useRef<Record<string, XTerm>>({});

  useEffect(() => {
    if (esRef.current) return;

    const eventSource = new EventSource("http://localhost:5601/api/execute");
    esRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const msg: Events = JSON.parse(event.data);

      dispatch(msg);
      const term = terminalMap.current[msg.terminalId];
      if (!term) return;

      switch (msg.type) {
        case "task_stdout":
        case "task_stderr":
          term.write(msg.data);
          break;

        case "task_started":
          term.write(`\r\n$ ${msg.command}\r\n`);
          break;
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      esRef.current = null;
    };

    return () => {
      eventSource.close();
      esRef.current = null;
    };
  }, []);

  return {
    state,
    registerTerminal: (id: string, term: XTerm) => {
      terminalMap.current[id] = term;
    },
  };
}
