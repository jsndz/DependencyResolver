import { useState } from "react";
import {
  Play,
  AlertCircle,
  GitBranch,
  Flag,
  AlertTriangle,
  Route,
  Zap,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { Task } from "../types";
import { useAnalysis } from "../hooks/useAnalysis";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

const analyses = [
  { type: "order" as const, label: "Resolve Order", icon: Play, description: "Topological order" },
  { type: "cycle" as const, label: "Detect Cycle", icon: AlertCircle, description: "Find cycles" },
  { type: "parallel" as const, label: "Parallel Plan", icon: GitBranch, description: "Execution levels" },
  { type: "terminal" as const, label: "Terminal Tasks", icon: Flag, description: "Leaf nodes" },
  { type: "unreachable" as const, label: "Unreachable", icon: AlertTriangle, description: "Orphan tasks" },
];

export default function AnalysisPanel({ tasks }: { tasks: Task[] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const analyze = useAnalysis();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
          <Zap size={18} />
        </div>
        <div>
          <CardTitle>Analysis</CardTitle>
          <CardDescription>Run checks on your dependency graph</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Run analysis */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Run analysis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analyses.map(({ type, label, icon: Icon, description }) => (
              <Button
                key={type}
                variant="outline"
                disabled={analyze.isPending}
                onClick={() => analyze.mutate({ type })}
                className="h-auto p-4 justify-start gap-3"
              >
                <div className="p-1.5 rounded-md bg-muted text-muted-foreground">
                  <Icon size={18} />
                </div>

                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </div>

                {analyze.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Find path */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Find path
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <ArrowRight className="text-muted-foreground" />

            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={!from || !to || from === to || analyze.isPending}
              onClick={() => analyze.mutate({ type: "path", from, to })}
              className="gap-2"
            >
              <Route size={16} />
              Find Path
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
