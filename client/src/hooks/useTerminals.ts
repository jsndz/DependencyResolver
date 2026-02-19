import { useEffect, useReducer, useRef } from "react";
import { terminalsReducer } from "../config/handleSSE";
import { Events, TerminalUIState } from "../types";

export function useTerminals() {
  const [state, dispatcher] = useReducer(terminalsReducer, {} as Record<string, TerminalUIState>);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    console.log("sub");
    if (esRef.current) return;
    const eventSource = new EventSource("http://localhost:5601/api/execute");

    eventSource.onmessage = (event) => {
      console.log("New data:", event.data);
      const events: Events = JSON.parse(event.data);
      dispatcher(events);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      esRef.current = null;

    };
    return () => {
      eventSource.close();
      esRef.current = null;
    };
  }, []);
  return state;
}
