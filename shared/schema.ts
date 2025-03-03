import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const deviceStats = pgTable("device_stats", {
  id: serial("id").primaryKey(),
  cpuUsage: integer("cpu_usage").notNull(),
  ramUsage: integer("ram_usage").notNull(),
  batteryLevel: integer("battery_level").notNull(),
  storageUsage: integer("storage_usage").notNull(),
  networkUsage: integer("network_usage").notNull().default(0),
  temperature: integer("temperature").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const backgroundApps = pgTable("background_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cpuUsage: integer("cpu_usage").notNull(),
  ramUsage: integer("ram_usage").notNull(),
  batteryImpact: integer("battery_impact").notNull(),
  isSystemApp: boolean("is_system_app").notNull().default(false),
  canBeClosed: boolean("can_be_closed").notNull().default(true),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const optimizations = pgTable("optimizations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  impact: integer("impact").notNull(),
  priority: text("priority").notNull(),
  actions: text("actions").array().notNull(),
  requiresPermission: boolean("requires_permission").notNull().default(false),
  isAutomated: boolean("is_automated").notNull().default(false),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  isPremium: boolean("is_premium").notNull().default(false),
  trialStartDate: timestamp("trial_start_date").notNull().defaultNow(),
  aiOptimizationEnabled: boolean("ai_optimization_enabled").notNull().default(false),
});

export const insertDeviceStatsSchema = createInsertSchema(deviceStats).omit({ 
  id: true,
  timestamp: true 
});

export const insertBackgroundAppSchema = createInsertSchema(backgroundApps).omit({ 
  id: true,
  timestamp: true 
});

export const insertOptimizationSchema = createInsertSchema(optimizations).omit({ 
  id: true,
  timestamp: true 
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  trialStartDate: true
});

export type DeviceStats = typeof deviceStats.$inferSelect;
export type InsertDeviceStats = z.infer<typeof insertDeviceStatsSchema>;
export type BackgroundApp = typeof backgroundApps.$inferSelect;
export type InsertBackgroundApp = z.infer<typeof insertBackgroundAppSchema>;
export type Optimization = typeof optimizations.$inferSelect;
export type InsertOptimization = z.infer<typeof insertOptimizationSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export function isInTrialPeriod(user: User): boolean {
  const trialDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  const trialEndDate = new Date(user.trialStartDate.getTime() + trialDuration);
  return trialEndDate > new Date();
}