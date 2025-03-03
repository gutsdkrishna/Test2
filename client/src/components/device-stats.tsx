import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, Battery, Database } from "lucide-react";
import type { DeviceStats } from "@shared/schema";

interface DeviceStatsProps {
  stats: DeviceStats;
}

export function DeviceStats({ stats }: DeviceStatsProps) {
  const metrics = [
    { icon: Cpu, label: "CPU Usage", value: stats.cpuUsage },
    { icon: Database, label: "RAM Usage", value: stats.ramUsage },
    { icon: Battery, label: "Battery", value: stats.batteryLevel },
    { icon: HardDrive, label: "Storage", value: stats.storageUsage }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {metrics.map(({ icon: Icon, label, value }) => (
        <Card key={label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {label}
            </CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}%</div>
            <Progress 
              value={value} 
              className={`mt-2 ${value > 80 ? "bg-red-100" : ""}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}