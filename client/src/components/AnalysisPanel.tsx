import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Network,
  TrendingUp,
  GitBranch,
  PlayCircle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Task } from "../types";

/* ----------------------- */
/* Dummy Data (Replace later) */
/* ----------------------- */

const dummyMetrics = {
  totalTasks: 15,
  depth: 5,
  maxParallel: 4,
  criticalLength: 5,
};

const dummyCriticalPath = [
  "zookeeper",
  "kafka",
  "auth",
  "gateway",
  "client",
];

const dummyBottlenecks = [
  { name: "kafka", blocks: 5 },
  { name: "gateway", blocks: 2 },
  { name: "auth.db", blocks: 1 },
];

const dummyRoots = ["zookeeper", "auth.volume", "fencer.volume"];

const dummyFailureImpact: Record<string, string[]> = {
  kafka: [
    "alert",
    "auth",
    "geo.fencer",
    "server",
    "location.logger",
    "gateway",
    "client",
  ],
  gateway: ["client"],
  auth: ["gateway", "client"],
};



export default function AnalysisPanel({tasks}: {tasks: Task[]}) {
  const [selectedFailure, setSelectedFailure] = useState("");

  const impacted = selectedFailure
    ? dummyFailureImpact[selectedFailure] || []
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <Activity size={18} />
        </div>
        <div>
          <CardTitle>Advanced Insights</CardTitle>
          <CardDescription>
            Architectural intelligence & execution analysis
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* -------------------- */}
        {/* Graph Metrics Summary */}
        {/* -------------------- */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Graph Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="Tasks" value={dummyMetrics.totalTasks} />
            <MetricCard label="Depth" value={dummyMetrics.depth} />
            <MetricCard label="Max Parallel" value={dummyMetrics.maxParallel} />
            <MetricCard
              label="Critical Path"
              value={dummyMetrics.criticalLength}
            />
          </div>
        </div>

        <Separator />

        {/* -------------------- */}
        {/* Critical Path */}
        {/* -------------------- */}
        <div>
          <SectionHeader
            icon={TrendingUp}
            title="Critical Path"
            description="Longest blocking execution chain"
          />

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {dummyCriticalPath.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <Badge variant="secondary">{step}</Badge>
                {i < dummyCriticalPath.length - 1 && (
                  <GitBranch size={14} className="text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* -------------------- */}
        {/* Bottlenecks */}
        {/* -------------------- */}
        <div>
          <SectionHeader
            icon={Network}
            title="Bottlenecks"
            description="Tasks that block the most dependents"
          />

          <div className="space-y-2 mt-3">
            {dummyBottlenecks.map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-between border rounded-md p-3"
              >
                <span className="font-medium">{b.name}</span>
                <Badge variant="destructive">
                  Blocks {b.blocks} task{b.blocks > 1 ? "s" : ""}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* -------------------- */}
        {/* Root Tasks */}
        {/* -------------------- */}
        <div>
          <SectionHeader
            icon={PlayCircle}
            title="Root Tasks"
            description="Tasks with no dependencies"
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {dummyRoots.map((root) => (
              <Badge key={root}>{root}</Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* -------------------- */}
        {/* Failure Simulation */}
        {/* -------------------- */}
        <div>
          <SectionHeader
            icon={AlertTriangle}
            title="Failure Simulation"
            description="See what breaks if a task fails"
          />

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <Select
              value={selectedFailure}
              onValueChange={setSelectedFailure}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select task" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(dummyFailureImpact).map((task) => (
                  <SelectItem key={task} value={task}>
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              disabled={!selectedFailure}
              onClick={() => {}}
            >
              Simulate
            </Button>
          </div>

          {selectedFailure && (
            <div className="mt-4 space-y-2">
              {impacted.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No downstream impact.
                </div>
              ) : (
                impacted.map((task) => (
                  <div
                    key={task}
                    className="border rounded-md p-2 text-sm"
                  >
                    {task}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------- */
/* Small UI Helpers */
/* ----------------------- */

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded-lg p-4 text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-md bg-muted text-muted-foreground">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}