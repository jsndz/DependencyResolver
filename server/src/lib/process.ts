import { spawn } from "child_process";
import type { Readable } from "stream";

export function runCommand(folder: string, command?: string): Promise<void> {
  return new Promise((res, rej) => {
    if (!command || typeof command !== "string") {
      throw new Error(`Invalid command: ${command}`);
    }

    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    if (!cmd) throw new Error(`Invalid command: ${command}`);

    const child = spawn(cmd, parts.slice(1), {
      cwd: folder,
      shell: true,
      stdio: "pipe",
    }) as { stdout: Readable; stderr: Readable };

    child.stdout.on("data", (d) => {
      console.log(d.toString());
      res(d.toString());
    });
    child.stderr.on("data", (d) => {
      console.error(d.toString());
      rej(new Error(d.toString()));
    });
  });
}
