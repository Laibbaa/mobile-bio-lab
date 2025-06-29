import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, hashPassword } from "../auth";
import { storage } from "../models/user";
import {
  insertSampleSchema,
  insertProtocolSchema,
  insertReportSchema,
  insertSensorDataSchema,
} from "@shared/schema";

// Helper function to validate numeric IDs
function validateId(id: string): number {
  const numId = Number.parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) {
    throw new Error("Invalid ID parameter");
  }
  return numId;
}

// Helper function for consistent error responses
function handleError(
  res: any,
  error: any,
  defaultMessage: string,
  statusCode = 500
) {
  console.error(error);
  if (error instanceof Error) {
    res.status(statusCode).json({
      message: defaultMessage,
      error: error.message,
    });
  } else {
    res.status(statusCode).json({
      message: defaultMessage,
      error: String(error),
    });
  }
}

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Sample routes
  app.get("/api/samples", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const samples =
        req.user!.role === "admin"
          ? await storage.getAllSamples()
          : await storage.getSamplesByUser(req.user!.id);
      res.json(samples);
    } catch (error) {
      handleError(res, error, "Failed to fetch samples");
    }
  });

  app.post("/api/samples", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      console.log(
        "[SAMPLE_CREATE] Request body:",
        JSON.stringify(req.body, null, 2)
      );

      const validatedData = insertSampleSchema.parse({
        ...req.body,
        userId: req.user!.id,
        collectionDate: new Date(req.body.collectionDate),
      });

      console.log(
        "[SAMPLE_CREATE] Validated data:",
        JSON.stringify(validatedData, null, 2)
      );

      const sample = await storage.createSample(validatedData);

      // Create notification
      await storage.createNotification({
        userId: req.user!.id,
        title: "Sample Submitted",
        message: `Sample ${sample.sampleId} has been submitted successfully`,
        type: "sample_entry",
      });

      res.status(201).json(sample);
    } catch (error) {
      console.error("[SAMPLE_CREATE_ERROR]", error);
      handleError(res, error, "Invalid sample data", 400);
    }
  });

  app.get("/api/samples/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = validateId(req.params.id);
      const sample = await storage.getSample(id);

      if (!sample) {
        return res.status(404).json({ message: "Sample not found" });
      }

      // Check if user can access this sample
      if (req.user!.role !== "admin" && sample.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(sample);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid sample ID" });
      }
      handleError(res, error, "Failed to fetch sample");
    }
  });

  app.put("/api/samples/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = validateId(req.params.id);
      const sample = await storage.getSample(id);

      if (!sample) {
        return res.status(404).json({ message: "Sample not found" });
      }

      // Check permissions
      if (req.user!.role !== "admin" && sample.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const validatedData = insertSampleSchema.partial().parse(req.body);
      const updatedSample = await storage.updateSample(id, validatedData);

      res.json(updatedSample);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid sample ID" });
      }
      handleError(res, error, "Invalid sample data", 400);
    }
  });

  // Protocol routes
  app.get("/api/protocols", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { search } = req.query;
      const protocols = search
        ? await storage.searchProtocols(search as string)
        : await storage.getAllProtocols();
      res.json(protocols);
    } catch (error) {
      handleError(res, error, "Failed to fetch protocols");
    }
  });

  app.post("/api/protocols", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const validatedData = insertProtocolSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
      });
      const protocol = await storage.createProtocol(validatedData);
      res.status(201).json(protocol);
    } catch (error) {
      handleError(res, error, "Invalid protocol data", 400);
    }
  });

  app.get("/api/protocols/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = validateId(req.params.id);
      const protocol = await storage.getProtocol(id);

      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found" });
      }

      res.json(protocol);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid protocol ID" });
      }
      handleError(res, error, "Failed to fetch protocol");
    }
  });

  // Report routes
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const reports =
        req.user!.role === "admin"
          ? await storage.getAllReports()
          : await storage.getReportsByUser(req.user!.id);
      res.json(reports);
    } catch (error) {
      handleError(res, error, "Failed to fetch reports");
    }
  });

  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const validatedData = insertReportSchema.parse({
        ...req.body,
        generatedBy: req.user!.id,
      });
      const report = await storage.createReport(validatedData);

      // Create notification
      await storage.createNotification({
        userId: req.user!.id,
        title: "Report Generated",
        message: `Report "${report.title}" has been generated`,
        type: "report_generated",
      });

      res.status(201).json(report);
    } catch (error) {
      handleError(res, error, "Invalid report data", 400);
    }
  });

  // User management routes (admin only)
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      handleError(res, error, "Failed to fetch users");
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const id = validateId(req.params.id);

      // Add basic validation for user update data
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
      }

      const updatedUser = await storage.updateUser(id, req.body);

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      handleError(res, error, "Invalid user data", 400);
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user!.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    try {
      const id = validateId(req.params.id);

      // Prevent admin from deleting themselves
      if (id === req.user!.id) {
        return res
          .status(400)
          .json({ message: "Cannot delete your own account" });
      }

      await storage.deleteUser(id);
      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      handleError(res, error, "Failed to delete user");
    }
  });

  // Notification routes
  app.get("/api/notifications", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const notifications = await storage.getNotificationsByUser(req.user!.id);
      res.json(notifications);
    } catch (error) {
      handleError(res, error, "Failed to fetch notifications");
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = validateId(req.params.id);
      await storage.markNotificationAsRead(id);
      res.sendStatus(200);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid notification ID" });
      }
      handleError(res, error, "Failed to mark notification as read");
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      handleError(res, error, "Failed to fetch dashboard stats");
    }
  });

  // Sensor data routes
  app.post("/api/sensor-data", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const validatedData = insertSensorDataSchema.parse(req.body);
      const sensorData = await storage.createSensorData(validatedData);
      res.status(201).json(sensorData);
    } catch (error) {
      handleError(res, error, "Invalid sensor data", 400);
    }
  });

  app.get("/api/sensor-data/sample/:sampleId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const sampleId = validateId(req.params.sampleId);
      const sensorData = await storage.getSensorDataBySample(sampleId);
      res.json(sensorData);
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid ID parameter") {
        return res.status(400).json({ message: "Invalid sample ID" });
      }
      handleError(res, error, "Failed to fetch sensor data");
    }
  });

  // Password reset route - Added authentication requirement for security
  app.post("/api/reset-password", async (req, res) => {
    // Require authentication for password reset
    if (!req.isAuthenticated()) return res.sendStatus(401);

    // Only allow admin or self password reset
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    try {
      const user = await storage.getUserByUsername(username);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user can reset this password (admin or own account)
      if (req.user!.role !== "admin" && req.user!.id !== user.id) {
        return res.status(403).json({
          message: "You can only reset your own password",
        });
      }

      const hashed = await hashPassword(password);
      await storage.updateUser(user.id, { password: hashed });

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      handleError(res, error, "Failed to reset password");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
