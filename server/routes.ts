import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Submissions API
  app.post("/api/submissions", async (req, res) => {
    try {
      console.log("[API] Received new submission:", req.body.title);
      const submission = await storage.createSubmission(req.body);
      res.status(201).json(submission);
    } catch (error: any) {
      console.error("[API] Submission error:", error.message);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/submissions", async (_req, res) => {
    const submissions = await storage.getSubmissions();
    console.log(`[API] Serving ${submissions.length} submissions`);
    res.json(submissions);
  });

  app.patch("/api/submissions/:id", async (req, res) => {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const updated = await storage.updateSubmissionStatus(id, status, feedback);
    if (!updated) return res.status(404).json({ message: "Submission not found" });
    res.json(updated);
  });

  // CDOC API
  app.get("/api/cdoc/metrics", async (_req, res) => {
    const metrics = await storage.getCdocMetrics();
    res.json(metrics);
  });

  app.get("/api/cdoc/events", async (_req, res) => {
    const events = await storage.getSecurityEvents();
    res.json(events);
  });

  app.get("/api/cdoc/peers", async (_req, res) => {
    const peers = await storage.getP2PPeers();
    res.json(peers);
  });

  app.post("/api/cdoc/events", async (req, res) => {
    const event = await storage.addSecurityEvent(req.body);
    res.status(201).json(event);
  });

  // Notifications API
  app.get("/api/notifications", async (_req, res) => {
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    await storage.markNotificationRead(id);
    res.json({ success: true });
  });

  return httpServer;
}
