import { useEffect, useReducer, useRef } from "react";
import { terminalsReducer } from "../config/handleSSE";
import { Events, TerminalUIState } from "../types";
import { Terminal as XTerm } from "@xterm/xterm";
import { useTasks } from "./useTasks";
import { useQueryClient } from "@tanstack/react-query";

export function useTerminals() {
  const [state, dispatch] = useReducer(
    terminalsReducer,
    {} as Record<string, TerminalUIState>,
  );
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource | null>(null);
  const terminalMap = useRef<Record<string, XTerm>>({});

  useEffect(() => {
    if (esRef.current) {
      return;
    }

    const eventSource = new EventSource("http://localhost:5601/api/execute");

    esRef.current = eventSource;

    eventSource.onopen = () => {};

    eventSource.onmessage = (event) => {
      try {
        const msg: Events = JSON.parse(event.data);

        dispatch(msg);

        const term = terminalMap.current[msg.terminalId];

        if (!term) {
          return;
        }

        switch (msg.type) {
          case "task_stdout":
            term.write(msg.data);
            break;

          case "task_stderr":
            term.write(msg.data);
            break;

          case "task_started":
            term.write(`\r\n$ ${msg.command}\r\n`);
            break;
          case "task_state":
            queryClient.setQueryData(["tasks"], (old: any) => {
              if (!old) return old;

              return {
                ...old,
                tasks: old.tasks.map((t: any) =>
                  t.id === msg.taskId ? { ...t, state: msg.state } : t,
                ),
              };
            });
            break;
          default:
            break;
        }
      } catch (err) {
        // Ignore parse errors
      }
    };

    eventSource.onerror = (err) => {
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
