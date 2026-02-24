import { ChildProcess, spawn } from "child_process";
import type { Response } from "express";
import net from "net";
import { runningProcesses, terminal, type Task } from "../store";

function selectTerminalId(task: Task): string {
  function createTerminalId() {
    return `term-${crypto.randomUUID()}`;
  }
  if (task.dependency.length === 0) {
    const id = createTerminalId();
    terminal.set(task.id, { terminalId: id, taken: false });
    return id;
  }

  if (task.dependency.length === 1) {
    const parent = terminal.get(task.dependency[0]!);
    if (!parent) throw new Error("Parent terminal not found");
    terminal.set(task.id, { terminalId: parent.terminalId, taken: true });
    parent.taken = true;
    return parent.terminalId;
  }

  for (const dep of task.dependency) {
    const parent = terminal.get(dep);
    if (parent && !parent.taken) {
      parent.taken = true;
      terminal.set(task.id, { terminalId: parent.terminalId, taken: true });
      return parent.terminalId;
    }
  }

  const id = createTerminalId();
  terminal.set(task.id, { terminalId: id, taken: false });
  return id;
}

export function runCommand(task: Task, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = task.command;
    const folder = task.folder;
    console.log(command, folder);

    if (!command || typeof command !== "string") {
      reject(new Error(`Invalid command: ${command}`));
      return;
    }

    const terminalId = selectTerminalId(task);

    res.write(
      `data: ${JSON.stringify({
        type: "terminal_open",
        terminalId,
        name: task.task,
      })}\n\n`,
    );

    res.write(
      `data: ${JSON.stringify({
        type: "task_started",
        terminalId,
        taskId: task.id,
        data: `execution@${task.task}:~${folder}$ ${command}\r\n`,

        command: command,
        folder: folder,
      })}\n\n`,
    );

    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    console.log(folder);

    const child = spawn(cmd!, parts.slice(1), {
      cwd: folder,
      shell: true,
      detached: true,
      stdio: "pipe",
    });
    task.state = "starting";
    runningProcesses.set(task.id, child);
    child.stdout.on("data", (d) => {
      console.log(d);

      res.write(
        `data: ${JSON.stringify({
          type: "task_stdout",
          terminalId,
          taskId: task.id,
          data: d.toString(),
        })}\n\n`,
      );
    });

    child.stderr.on("data", (d) => {
      console.log(d);
      res.write(
        `data: ${JSON.stringify({
          type: "task_stderr",
          terminalId,
          taskId: task.id,
          data: d.toString(),
        })}\n\n`,
      );
    });

    (child as any).on("close", (code: number | null) => {
      const entry = terminal.get(task.id);
      if (entry) {
        entry.taken = false;
      }
      const ok = code === 0 || code === null;
      runningProcesses.delete(task.id);
      res.write(
        `data: ${JSON.stringify({
          type: "task_finished",
          terminalId,
          taskId: task.id,
          status: ok ? "success" : "failed",
          exitCode: code,
        })}\n\n`,
      );
      resolve();
    });

    (child as any).on("error", reject);
  });
}

async function readynessCheck(task: Task, child: ChildProcess): Promise<void> {
  if (task.ready?.kind === "exit") {
    return ;
  } else if (task.ready?.kind === "port") {
    return await checkPort(task.ready.port);
  } else if (task.ready?.kind === "log") {
    await checkLogs();
  }
}
function checkPort(
  port: number,
  ip = "192.0.0.1",
  timeout = 30_000,
): Promise<void> {
  const startTime = Date.now();
  return new Promise<void>((res, rej) => {
    const connect = () => {
      const socket = new net.Socket();

      socket.on("connect", () => {
        socket.destroy();
        res();
      });
      socket.on("error", () => {
        socket.destroy();
        retry();
      });
      socket.on("timeout", () => {
        socket.destroy();
        retry();
      });
      socket.connect(port, ip);
    };

    const retry = () => {
      if (Date.now() - startTime > timeout) {
        rej(new Error("timeout"));
      } else {
        setTimeout(connect, 200);
      }
    };
    connect();
  });
}


function checkLogs() {
  
}