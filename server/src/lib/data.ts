import { tasks, dependencies } from "../store";
import type { Task } from "../store";
export function addMockData() {
    const task1: Task = {
        task: "install frontend",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/client",
        command: "npm i",
        dependency: [],
      };
    
      const task2: Task = {
        task: "run frontend",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/client",
        command: "npm run dev",
        dependency: [],
      };
    
      const task3: Task = {
        task: "install backend",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/server",
        command: "npm i",
        dependency: [],
      };
    
      const task4: Task = {
        task: "start mongodb",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/server",
        command: "docker start mongodb",
        dependency: [],
      };
    
      const task6: Task = {
        task: "run backend",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/server",
        command: "npm start",
        dependency: [],
      };
    
      const task5: Task = {
        task: "backend tests",
        id: crypto.randomUUID(),
        folder: "/home/jaison/code/projects/twitter/server",
        command: "npm test",
        dependency: [],
      };
    
      const all = [task1, task2, task3, task4, task5, task6];
      tasks.push(...all);
    
      const deps = [
        { from: task1.id, to: task2.id },
    
        { from: task3.id, to: task6.id },
        { from: task6.id, to: task5.id },
      ];
    
      for (const { from, to } of deps) {
        const child = all.find(t => t.id === to)!;
        child.dependency.push(from);
      }
    
      dependencies.push(...deps);
}