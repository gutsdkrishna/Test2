/**
 * Performance Metrics Component
 * Displays animated visualizations of device performance metrics
 * Features:
 * - Animated progress indicators
 * - Real-time updates
 * - Responsive design
 */

import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DeviceStats } from "@shared/schema";

interface MetricCardProps {
  title: string;
  value: number;
  color: string;
  isGood: boolean;
}

/**
 * Animated Metric Card Component
 * Displays individual performance metrics with animations
 */
function MetricCard({ title, value, color, isGood }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-20"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: `4px solid ${color}`,
                opacity: 0.2
              }}
            />
            <motion.div
              className="absolute text-2xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {value}%
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`text-sm mt-2 ${isGood ? 'text-green-500' : 'text-amber-500'}`}
        >
          {isGood ? 'Optimal' : 'Needs Attention'}
        </motion.div>
      </CardContent>
    </Card>
  );
}

interface TimelineData {
  time: string;
  cpu: number;
  ram: number;
  battery: number;
  storage: number;
}

/**
 * Performance Timeline Component
 * Shows historical performance data in an animated line chart
 */
function PerformanceTimeline({ data }: { data: TimelineData[] }) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Performance Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="ram" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
              <Line 
                type="monotone" 
                dataKey="battery" 
                stroke="#ffc658" 
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Performance Metrics Component
 * Combines all performance visualizations
 */
export function PerformanceMetrics({ stats }: { stats: DeviceStats }) {
  // Mock timeline data - in a real app, this would come from historical data
  const timelineData: TimelineData[] = [
    { time: '5m ago', cpu: 45, ram: 60, battery: 85, storage: 70 },
    { time: '4m ago', cpu: 48, ram: 62, battery: 83, storage: 70 },
    { time: '3m ago', cpu: 52, ram: 65, battery: 81, storage: 71 },
    { time: '2m ago', cpu: 49, ram: 63, battery: 80, storage: 71 },
    { time: '1m ago', cpu: stats.cpuUsage, ram: stats.ramUsage, battery: stats.batteryLevel, storage: stats.storageUsage },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="CPU Usage"
            value={stats.cpuUsage}
            color="#8884d8"
            isGood={stats.cpuUsage < 70}
          />
          <MetricCard
            title="RAM Usage"
            value={stats.ramUsage}
            color="#82ca9d"
            isGood={stats.ramUsage < 80}
          />
          <MetricCard
            title="Battery Level"
            value={stats.batteryLevel}
            color="#ffc658"
            isGood={stats.batteryLevel > 20}
          />
          <MetricCard
            title="Storage Usage"
            value={stats.storageUsage}
            color="#ff7300"
            isGood={stats.storageUsage < 85}
          />
        </div>
        <PerformanceTimeline data={timelineData} />
      </motion.div>
    </AnimatePresence>
  );
}
