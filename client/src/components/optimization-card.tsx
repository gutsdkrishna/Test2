import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { DeviceStats } from "@shared/schema";
import { analyzeDeviceStats, calculateOverallPerformance } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function OptimizationCard() {
  const { data: stats } = useQuery<DeviceStats>({
    queryKey: ["/api/device-stats"],
  });

  if (!stats) {
    return null;
  }

  const suggestions = analyzeDeviceStats(stats);
  const performanceScore = calculateOverallPerformance(stats);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Performance</span>
            <span className="text-sm font-medium">{performanceScore}%</span>
          </div>
          <Progress value={performanceScore} />
        </div>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span className="font-medium">{suggestion.title}</span>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                {suggestion.description}
              </p>
              <div className="pl-7 flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  Potential Impact:
                </span>
                <span className="text-xs font-medium text-green-600">
                  +{suggestion.impact}% Performance
                </span>
              </div>
            </div>
          ))}

          {suggestions.length === 0 && (
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-5 w-5" />
              <span>System is running optimally</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}