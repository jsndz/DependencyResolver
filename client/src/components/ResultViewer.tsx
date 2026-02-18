import { FileJson, List } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Task } from "../types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export default function ResultViewer({ tasks }: { tasks: Task[] }) {
  const { analysisType, analysisData } = useAppStore();

  const name = (id: string) =>
    tasks.find((t) => t.id === id)?.task ?? id;

  const hasResults = analysisType && analysisData != null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
          <FileJson size={18} />
        </div>
        <div>
          <CardTitle>Results</CardTitle>
          <CardDescription className="capitalize">
            {hasResults
              ? analysisType.replace(/_/g, " ")
              : "Analysis output appears here"}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        {!hasResults ? (
          <EmptyState />
        ) : (
          <ScrollArea className="h-full px-6 pb-6">
            {Array.isArray(analysisData) ? (
              <ul className="space-y-2 pt-2">
                {analysisData.map((x, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground font-mono w-6 text-xs">
                      {i + 1}.
                    </span>
                    <span className="flex-1 truncate">
                      {typeof x === "string" ? name(x) : JSON.stringify(x)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="mt-2 rounded-md bg-zinc-950 text-zinc-100 p-4 text-xs font-mono overflow-x-auto border">
                {JSON.stringify(analysisData, null, 2)}
              </pre>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-12 text-muted-foreground">
      <div className="p-4 rounded-full bg-muted">
        <List className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-medium">No results yet</p>
        <p className="text-xs">Run an analysis to see output</p>
      </div>
    </div>
  );
}
