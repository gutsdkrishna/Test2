import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getAIOptimizations } from "./services/ai";

// Sample data for testing the connection
const sampleData = {
  courses: [
    { id: 1, title: "Advanced Mathematics", instructor: "Dr. Smith", rating: 4.8 },
    { id: 2, title: "Computer Science Basics", instructor: "Prof. Johnson", rating: 4.5 },
    { id: 3, title: "Data Structures", instructor: "Dr. Williams", rating: 4.9 }
  ]
};

/**
 * Debug Logger for API Routes
 * Tracks API requests and responses for monitoring
 */
function routeDebugLog(route: string, action: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] API DEBUG - ${route} - ${action}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * Register API Routes
 * Sets up all API endpoints for the BoostIQ Pro application
 * 
 * Key endpoints:
 * - /api/device-stats: Get current device statistics
 * - /api/background-apps: List running applications
 * - /api/optimize: Trigger AI-powered optimization
 */
export async function registerRoutes(app: Express): Promise<Server> {
  const server = createServer(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Sample API endpoint
  app.get("/api/courses", (req, res) => {
    res.json(sampleData.courses);
  });

  // Get current device statistics
  app.get("/api/device-stats", async (_req, res) => {
    const stats = await storage.getLatestDeviceStats();
    routeDebugLog("/api/device-stats", "Retrieved device stats", stats);
    res.json(stats);
  });

  // Get list of background applications
  app.get("/api/background-apps", async (_req, res) => {
    const apps = await storage.getBackgroundApps();
    routeDebugLog("/api/background-apps", "Retrieved background apps", apps);
    res.json(apps);
  });

  // Get optimization history
  app.get("/api/optimizations", async (_req, res) => {
    const optimizations = await storage.getOptimizations();
    routeDebugLog("/api/optimizations", "Retrieved optimization history", optimizations);
    res.json(optimizations);
  });

  // Trigger AI-powered optimization
  app.post("/api/optimize", async (_req, res) => {
    try {
      routeDebugLog("/api/optimize", "Starting optimization process");

      // Gather current system state
      const stats = await storage.getLatestDeviceStats();
      const backgroundApps = await storage.getBackgroundApps();

      routeDebugLog("/api/optimize", "Current system state", { stats, backgroundApps });

      // Get AI-powered optimization recommendations
      const optimization = await getAIOptimizations(stats, backgroundApps);
      await storage.insertOptimization(optimization);

      routeDebugLog("/api/optimize", "AI optimization result", optimization);

      // Apply automated optimizations if possible
      if (optimization.isAutomated && !optimization.requiresPermission) {
        routeDebugLog("/api/optimize", "Applying automated optimizations", optimization.actions);
        console.log("Applying automated optimizations:", optimization.actions);
        // In a real app, this would use system APIs to perform the actions
      }

      res.json(optimization);
    } catch (error) {
      console.error("Optimization error:", error);
      routeDebugLog("/api/optimize", "Optimization failed", { error: error.message });
      res.status(500).json({ message: "Failed to optimize device" });
    }
  });

  // Check premium access status (temporarily always returns true for testing)
  app.get("/api/pro-access", async (_req, res) => {
    // Always return true for testing AI features
    const response = { 
      canAccess: true,
      aiEnabled: true
    };
    routeDebugLog("/api/pro-access", "Checked pro access", response);
    res.json(response);
  });

  // Toggle AI optimization settings
  app.post("/api/toggle-ai-optimization", async (req, res) => {
    try {
      const userId = 1; // Temporary for demo
      const { enabled } = req.body;
      await storage.updateUserAIPermissions(userId, enabled);
      routeDebugLog("/api/toggle-ai-optimization", "Updated AI permissions", { userId, enabled });
      res.json({ success: true });
    } catch (error) {
      routeDebugLog("/api/toggle-ai-optimization", "Failed to update permissions", { error: error.message });
      res.status(500).json({ message: "Failed to update AI permissions" });
    }
  });

  return server;
}