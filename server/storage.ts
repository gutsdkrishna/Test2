import { DeviceStats, InsertDeviceStats, Optimization, InsertOptimization, User, InsertUser, isInTrialPeriod, BackgroundApp, InsertBackgroundApp } from "@shared/schema";

export interface IStorage {
  getLatestDeviceStats(): Promise<DeviceStats>;
  insertDeviceStats(stats: InsertDeviceStats): Promise<DeviceStats>;
  getBackgroundApps(): Promise<BackgroundApp[]>;
  insertBackgroundApp(app: InsertBackgroundApp): Promise<BackgroundApp>;
  getOptimizations(): Promise<Optimization[]>;
  insertOptimization(optimization: InsertOptimization): Promise<Optimization>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  canAccessProFeatures(userId: number): Promise<boolean>;
  updateUserAIPermissions(userId: number, enabled: boolean): Promise<void>;
}

export class MemStorage implements IStorage {
  private deviceStats: DeviceStats[];
  private backgroundApps: BackgroundApp[];
  private optimizations: Optimization[];
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.deviceStats = [];
    this.backgroundApps = [];
    this.optimizations = [];
    this.users = new Map();
    this.currentId = 1;

    // Add some initial background apps for demo
    this.backgroundApps.push(
      {
        id: this.currentId++,
        name: "Social Media App",
        cpuUsage: 15,
        ramUsage: 200,
        batteryImpact: 10,
        isSystemApp: false,
        canBeClosed: true,
        timestamp: new Date()
      },
      {
        id: this.currentId++,
        name: "System Services",
        cpuUsage: 5,
        ramUsage: 150,
        batteryImpact: 5,
        isSystemApp: true,
        canBeClosed: false,
        timestamp: new Date()
      }
    );
  }

  async getLatestDeviceStats(): Promise<DeviceStats> {
    return this.deviceStats[this.deviceStats.length - 1] || {
      id: 0,
      cpuUsage: 45,
      ramUsage: 60,
      batteryLevel: 85,
      storageUsage: 70,
      networkUsage: 30,
      temperature: 38,
      timestamp: new Date()
    };
  }

  async insertDeviceStats(stats: InsertDeviceStats): Promise<DeviceStats> {
    const id = this.currentId++;
    const newStats = { ...stats, id, timestamp: new Date() };
    this.deviceStats.push(newStats);
    return newStats;
  }

  async getBackgroundApps(): Promise<BackgroundApp[]> {
    return this.backgroundApps;
  }

  async insertBackgroundApp(app: InsertBackgroundApp): Promise<BackgroundApp> {
    const id = this.currentId++;
    const newApp = { ...app, id, timestamp: new Date() };
    this.backgroundApps.push(newApp);
    return newApp;
  }

  async getOptimizations(): Promise<Optimization[]> {
    return this.optimizations;
  }

  async insertOptimization(optimization: InsertOptimization): Promise<Optimization> {
    const id = this.currentId++;
    const newOptimization = { 
      ...optimization,
      priority: optimization.priority || "medium",
      actions: optimization.actions || [],
      requiresPermission: optimization.requiresPermission || false,
      isAutomated: optimization.isAutomated || false,
      id,
      timestamp: new Date()
    };
    this.optimizations.push(newOptimization);
    return newOptimization;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser = { 
      ...user,
      id,
      isPremium: user.isPremium || false,
      aiOptimizationEnabled: false,
      trialStartDate: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async canAccessProFeatures(userId: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user) return false;
    return user.isPremium || isInTrialPeriod(user);
  }

  async updateUserAIPermissions(userId: number, enabled: boolean): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.aiOptimizationEnabled = enabled;
      this.users.set(userId, user);
    }
  }
}

export const storage = new MemStorage();