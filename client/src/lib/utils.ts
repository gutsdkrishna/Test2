import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DeviceStats } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  impact: number;
}

export function analyzeDeviceStats(stats: DeviceStats): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];

  if (stats.cpuUsage > 70) {
    suggestions.push({
      title: "High CPU Usage Detected",
      description: "Multiple resource-intensive applications are running. Consider closing unused applications to improve performance.",
      impact: 25
    });
  }

  if (stats.ramUsage > 80) {
    suggestions.push({
      title: "Memory Optimization Required",
      description: "System memory is reaching capacity. Clear application cache and close background processes.",
      impact: 20
    });
  }

  if (stats.batteryLevel < 30) {
    suggestions.push({
      title: "Battery Optimization",
      description: "Enable power saving mode and adjust screen brightness to extend battery life.",
      impact: 15
    });
  }

  if (stats.storageUsage > 85) {
    suggestions.push({
      title: "Storage Space Critical",
      description: "Low storage space may impact system performance. Remove unnecessary files and clear temporary data.",
      impact: 18
    });
  }

  return suggestions;
}

export function calculateOverallPerformance(stats: DeviceStats): number {
  const weights = {
    cpu: 0.3,
    ram: 0.3,
    battery: 0.2,
    storage: 0.2
  };

  const cpuScore = 100 - stats.cpuUsage;
  const ramScore = 100 - stats.ramUsage;
  const batteryScore = stats.batteryLevel;
  const storageScore = 100 - stats.storageUsage;

  return Math.round(
    cpuScore * weights.cpu +
    ramScore * weights.ram +
    batteryScore * weights.battery +
    storageScore * weights.storage
  );
}