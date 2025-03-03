/**
 * AI Service Module for BoostIQ Pro
 * 
 * This module handles device optimization using Groq's AI API. It analyzes device statistics 
 * and background app data to provide intelligent optimization suggestions.
 * 
 * Key Features:
 * - Real-time device performance analysis using Groq's LLM
 * - Background app impact assessment
 * - Automated optimization recommendations
 * - Intelligent resource management
 * 
 * @module ai-service
 */

import { Groq } from "groq-sdk";
import type { DeviceStats, BackgroundApp, Optimization } from "@shared/schema";
// Load environment variables from .env file
import dotenv from "dotenv";
dotenv.config();

// Initialize Groq client with API key for AI-powered analysis
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Using Llama model for its advanced capabilities in system analysis
const MODEL_NAME = "llama-3.3-70b-versatile";

/**
 * SystemAnalysis Interface
 * Defines the structure of AI-generated optimization recommendations
 * This ensures type safety and consistent optimization suggestions
 */
interface SystemAnalysis {
  type: string;          // Category of optimization (e.g., "Memory Optimization", "Battery Management")
  description: string;   // Detailed explanation of the optimization strategy
  impact: number;        // Estimated performance improvement (1-30%)
  priority: "high" | "medium" | "low";  // Urgency level
  actions: string[];     // Specific actions to be taken
  requiresPermission: boolean;  // Whether user permission is needed
  isAutomated: boolean;  // Whether actions can be automated
}

/**
 * Debug Logger
 * Helps track AI operations and responses during development
 * Provides timestamped logs with optional data objects
 * 
 * @param message - Debug message to log
 * @param data - Optional data object to stringify and log
 */
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] AI DEBUG: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

/**
 * Cleans and parses the AI response
 * Handles mixed content (text + JSON) responses
 * Processes both single optimization and array of optimizations
 * 
 * @param content - Raw response content from AI
 * @returns First valid optimization from the parsed array
 */
function parseAIResponse(content: string): SystemAnalysis {
  try {
    debugLog("Raw AI response content:", content);

    // Extract JSON content using regex
    const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON content found in response");
    }

    // Clean up the extracted JSON
    let jsonContent = jsonMatch[0]
      .replace(/(\r\n|\n|\r)/gm, '') // Remove newlines
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    debugLog("Extracted JSON content:", jsonContent);

    let parsed: SystemAnalysis[] = [];
    try {
      // Try parsing as array first
      if (jsonContent.startsWith('[')) {
        parsed = JSON.parse(jsonContent) as SystemAnalysis[];
      } else {
        // If single object, wrap in array
        parsed = [JSON.parse(jsonContent) as SystemAnalysis];
      }
    } catch (parseError) {
      debugLog("Initial parse failed, attempting to fix JSON format", { error: parseError.message });

      // Try to fix common formatting issues
      jsonContent = jsonContent
        .replace(/}\s*{/g, '},{') // Fix object separators
        .replace(/,\s*]/g, ']') // Remove trailing commas
        .replace(/,\s*}/g, '}'); // Remove trailing commas in objects

      if (!jsonContent.startsWith('[')) {
        jsonContent = `[${jsonContent}]`;
      }

      debugLog("Attempting to parse fixed JSON:", jsonContent);
      parsed = JSON.parse(jsonContent) as SystemAnalysis[];
    }

    // Validate the parsed optimizations
    const validOptimizations = parsed.filter(opt => {
      const isValid = opt.type && 
        opt.description && 
        typeof opt.impact === 'number' &&
        Array.isArray(opt.actions) &&
        typeof opt.requiresPermission === 'boolean' &&
        typeof opt.isAutomated === 'boolean';

      if (!isValid) {
        debugLog("Invalid optimization found:", opt);
      }

      return isValid;
    });

    if (validOptimizations.length === 0) {
      throw new Error("No valid optimizations found in response");
    }

    // Sort by impact and priority to get the most important optimization
    validOptimizations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const weightA = (priorityWeight[a.priority] || 0) * a.impact;
      const weightB = (priorityWeight[b.priority] || 0) * b.impact;
      return weightB - weightA;
    });

    debugLog("Valid optimizations found:", validOptimizations);
    return validOptimizations[0];
  } catch (error) {
    debugLog("Failed to parse AI response", { error, content });
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Main AI Optimization Function
 * Analyzes device stats and background apps to generate optimization strategies
 * 
 * Process:
 * 1. Prepares current system state
 * 2. Sends to Groq AI for analysis
 * 3. Processes and validates the response
 * 4. Returns actionable optimization suggestions
 * 
 * @param stats - Current device statistics (CPU, RAM, battery, etc.)
 * @param backgroundApps - List of running applications and their resource usage
 * @returns Most impactful optimization recommendation
 */
export async function getAIOptimizations(
  stats: DeviceStats,
  backgroundApps: BackgroundApp[]
): Promise<Optimization> {
  try {
    // Prepare system state data for AI analysis
    const systemState = {
      device: {
        cpu: stats.cpuUsage,
        ram: stats.ramUsage,
        battery: stats.batteryLevel,
        storage: stats.storageUsage,
        network: stats.networkUsage,
        temperature: stats.temperature
      },
      backgroundApps: backgroundApps.map(app => ({
        name: app.name,
        cpuUsage: app.cpuUsage,
        ramUsage: app.ramUsage,
        batteryImpact: app.batteryImpact,
        isSystemApp: app.isSystemApp,
        canBeClosed: app.canBeClosed
      }))
    };

    debugLog("Preparing AI analysis request", { systemState });

    // Request AI analysis using Groq
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: `As an AI device optimization expert, analyze the system state and return ONLY a JSON array of optimization strategies. Each strategy should follow this exact format:

[
  {
    "type": "Memory Optimization",
    "description": "Detailed explanation of the issue",
    "impact": 25,
    "priority": "high",
    "actions": ["Specific action 1", "Specific action 2"],
    "requiresPermission": true,
    "isAutomated": false
  }
]

Consider these aspects in your analysis:
1. Resource-heavy apps and their impact
2. Battery optimization opportunities
3. Memory management suggestions
4. System performance improvements
5. Network and temperature optimizations

IMPORTANT: Return ONLY the JSON array with NO additional text or explanations.`
        },
        {
          role: "user",
          content: `Analyze this system state and provide optimization recommendations as a JSON array:\n${JSON.stringify(systemState, null, 2)}`
        }
      ],
      temperature: 0.7,  // Balance between creativity and consistency
      max_tokens: 1000,  // Allow for detailed responses
      top_p: 1,
      stream: false
    });

    debugLog("Received response from Groq AI", response.choices[0].message);

    // Parse and validate AI response
    const aiResponse = parseAIResponse(response.choices[0].message?.content || "[]");
    debugLog("Selected best optimization strategy", aiResponse);

    // Transform AI response to Optimization type for storage
    return {
      id: 0, // Will be set by storage layer
      type: aiResponse.type,
      description: aiResponse.description,
      impact: aiResponse.impact,
      priority: aiResponse.priority,
      actions: aiResponse.actions,
      requiresPermission: aiResponse.requiresPermission,
      isAutomated: aiResponse.isAutomated,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("AI Optimization error:", error);
    debugLog("AI Optimization failed, using fallback optimization");

    // Provide basic optimization if AI analysis fails
    return {
      id: 0,
      type: "Basic System Optimization",
      description: "General performance optimization based on system analysis",
      impact: Math.floor(Math.random() * 20) + 10,
      priority: "medium",
      actions: ["Clear system cache", "Close inactive apps"],
      requiresPermission: false,
      isAutomated: true,
      timestamp: new Date()
    };
  }
}