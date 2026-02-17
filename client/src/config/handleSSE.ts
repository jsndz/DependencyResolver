import { Events, TerminalUIState } from "../types";

type State = Record<string, TerminalUIState>;

export function terminalsReducer(state: State, event: Events): State {
    switch (event.type) {
      case "terminal_open": {
        if (state[event.terminalId]) return state;
  
        return {
          ...state,
          [event.terminalId]: {
            terminalId: event.terminalId,
            lines: [],
            status: "running",
            name: event.name,
          },
        };
      }

      case "task_started":{
        if (state[event.terminalId]) return state;
  
        return {
          ...state,
          [event.terminalId]: {
            terminalId: event.terminalId,
            lines: [],
            status: "running",
            
            folder: event.folder
          },
        };
      }

  
      case "task_stdout":
      case "task_stderr": {
        const terminal = state[event.terminalId];
        if (!terminal) return state;
  
        return {
          ...state,
          [event.terminalId]: {
            ...terminal,
            lines: [...terminal.lines, event.data],
          },
        };
      }
  
      case "task_finished": {
        const terminal = state[event.terminalId];
        if (!terminal) return state;
  
        return {
          ...state,
          [event.terminalId]: {
            ...terminal,
            status: event.status,
          },
        };
      }
  
      default:
        return state;
    }
  }