import { DeviceStats } from "@/components/device-stats";
import { BoostButton } from "@/components/boost-button";
import { OptimizationCard } from "@/components/optimization-card";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeviceStats as DeviceStatsType } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DeviceStatsType>({
    queryKey: ["/api/device-stats"],
  });

  return (
    <div className="container mx-auto px-4 py-24 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Device Performance
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and optimize your device performance
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : stats ? (
        <PerformanceMetrics stats={stats} />
      ) : null}

      <div className="max-w-md mx-auto">
        <BoostButton />
      </div>

      <OptimizationCard />
    </div>
  );
}