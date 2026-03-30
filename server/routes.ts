import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { threatEngine } from "./threat-engine";
import { log } from "./utils";
import { osintEngine } from "./osint-engine";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  log("Registering API endpoints...", "routes");

  // Submissions API
  app.post("/api/submissions", async (req, res) => {
    try {
      log(`Received new submission: ${req.body.title}`, "api");
      const submission = await storage.createSubmission(req.body);
      res.status(201).json(submission);
    } catch (error: any) {
      log(`Submission error: ${error.message}`, "api");
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/submissions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    let submissions = await storage.getSubmissions();
    const user = req.user!;

    if (user.role === "researcher") {
      // Researchers only see their own submissions
      submissions = submissions.filter(s => s.userId === user.id);
    } else if (user.role === "police" || user.role === "enterprise") {
      // Police/Enterprise only see verified intelligence
      submissions = submissions.filter(s => s.status === "verified");
    }
    // Admins see everything

    log(`Serving ${submissions.length} submissions to ${user.username} (${user.role})`, "api");
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
  app.get("/api/notifications", async (req, res) => {
    // For now notifications are global for demo, but we should filter them
    const notifications = await storage.getNotifications();
    res.json(notifications);
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    const { id } = req.params;
    await storage.markNotificationRead(id);
    res.json({ success: true });
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.addNotification(req.body);
      res.status(201).json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Advanced Threat Intelligence API
  app.get("/api/threat-intelligence/signals", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const signals = submissions
        .filter(sub => sub.status === "verified")
        .map(sub => threatEngine.generateThreatSignal(sub));

      log(`Generated ${signals.length} threat signals`, "api");
      res.json(signals);
    } catch (error: any) {
      log(`Threat signals error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/threat-intelligence/correlations", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const verified = submissions.filter(sub => sub.status === "verified");
      const correlations = threatEngine.correlateThreats(verified);

      const result = Array.from(correlations.entries()).map(([id, related]: [any, any]) => ({
        threatId: id,
        correlatedThreats: related
      }));

      log(`Generated correlations for ${result.length} threats`, "api");
      res.json(result);
    } catch (error: any) {
      log(`Correlation error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/threat-intelligence/risk-map", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const verified = submissions.filter(sub => sub.status === "verified");

      // Generate risk maps for monitored entities
      const entities = [
        { id: "jpm", name: "JPMorgan Chase" },
        { id: "gs", name: "Goldman Sachs" },
        { id: "ms", name: "Morgan Stanley" },
        { id: "blk", name: "BlackRock" },
        { id: "c", name: "Citigroup" },
        { id: "wfc", name: "Wells Fargo" }
      ];

      const riskMaps = entities.map(entity =>
        threatEngine.generateRiskMap(entity.id, entity.name, verified)
      );

      log(`Generated risk maps for ${riskMaps.length} entities`, "api");
      res.json(riskMaps);
    } catch (error: any) {
      log(`Risk map error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/threat-intelligence/prioritized", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const verified = submissions.filter(sub => sub.status === "verified");
      const prioritized = threatEngine.prioritizeThreats(verified);

      log(`Prioritized ${prioritized.length} threats`, "api");
      res.json(prioritized);
    } catch (error: any) {
      log(`Prioritization error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/threat-intelligence/clusters", async (_req, res) => {
    try {
      const submissions = await storage.getSubmissions();
      const verified = submissions.filter(sub => sub.status === "verified");
      const clusters = threatEngine.detectThreatClusters(verified);

      const result = Array.from(clusters.entries()).map(([category, threats]: [any, any]) => ({
        category,
        count: threats.length,
        threats: threats.map((t: any) => ({ id: t.id, title: t.title, severity: t.severity }))
      }));

      log(`Detected ${result.length} threat clusters`, "api");
      res.json(result);
    } catch (error: any) {
      log(`Clustering error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  // Police Cases API
  app.get("/api/police/cases", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      let cases = await storage.getPoliceCases();
      const user = req.user!;

      if (user.role === "police") {
        // In the H3M4 Command Center, police can see all active cyber investigations
        // for better cross-agency correlation.
        log(`[API] Serving all cases to officer ${user.username}`, "api");
      } else if (user.role === "researcher" || user.role === "enterprise") {
        // Non-police/admin shouldn't see police cases
        return res.status(403).json({ message: "Access denied" });
      }

      log(`Serving ${cases.length} cases to officer ${user.username}`, "api");
      res.json(cases);
    } catch (error: any) {
      log(`Police cases error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/police/cases/:id", async (req, res) => {
    const { id } = req.params;
    log(`[API] Requesting police case ID: ${id}`, "api");
    try {
      const policeCase = await storage.getPoliceCase(id);
      if (!policeCase) {
        log(`[API] Case not found for ID: ${id}`, "api");
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(policeCase);
    } catch (error: any) {
      log(`[API_ERROR] Police case error for ${id}: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/police/cases", async (req, res) => {
    try {
      log(`Creating new police case: ${req.body.firNumber}`, "api");
      const policeCase = await storage.createPoliceCase(req.body);
      res.status(201).json(policeCase);
    } catch (error: any) {
      log(`Police case creation error: ${error.message}`, "api");
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/police/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updatePoliceCase(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Case not found" });
      }
      log(`Updated police case: ${updated.firNumber}`, "api");
      res.json(updated);
    } catch (error: any) {
      log(`Police case update error: ${error.message}`, "api");
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/police/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePoliceCase(id);
      if (!deleted) {
        return res.status(404).json({ message: "Case not found" });
      }
      log(`Deleted police case: ${id}`, "api");
      res.json({ success: true });
    } catch (error: any) {
      log(`Police case deletion error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  // Automated Investigation Bridge
  app.post("/api/police/cases/:id/analyze", async (req, res) => {
    const { id } = req.params;
    log(`[AUTOMATION] Hit analyze route for ID: ${id}`, "api");

    try {
      const policeCase = await storage.getPoliceCase(id);
      if (!policeCase) {
        log(`[AUTOMATION] Case not found for ID: ${id}`, "api");
        return res.status(404).json({ message: "Investigation Record Not Found" });
      }

      log(`[AUTOMATION] Running Investigation Bridge for FIR: ${policeCase.firNumber}`, "api");

      log(`[AUTOMATION] Step 1: Fetching Global Intel...`, "api");
      const globalIntel = await storage.getSubmissions();
      const verifiedIntel = globalIntel.filter(s => s.status === "verified");

      log(`[AUTOMATION] Step 2: Running Correlation Engine...`, "api");
      let matches: any[] = [];
      try {
        matches = threatEngine.matchPoliceCaseToIntelligence(policeCase, verifiedIntel);
        log(`[AUTOMATION] Found ${matches.length} matches.`, "api");
      } catch (err: any) {
        log(`[AUTOMATION_ERROR] Correlation Engine failed: ${err.message}`, "api");
      }

      log(`[AUTOMATION] Step 3: Running OSINT Enrichment...`, "api");
      let osintResults: any[] = [];
      try {
        // Fetch specific evidence for this case to enrich correlation
        const caseEvidence = await storage.getEvidence(id);
        const evidenceText = caseEvidence.map(e => `${e.description} ${e.technicalData || ""}`).join(" ");

        const combinedText = `${policeCase.caseTitle || ""} ${policeCase.victimDetails || ""} ${policeCase.suspectDetails || ""} ${evidenceText}`;
        osintResults = await osintEngine.enrichCaseIocs(combinedText);
        log(`[AUTOMATION] Found ${osintResults.length} OSINT results.`, "api");
      } catch (err: any) {
        log(`[AUTOMATION_ERROR] OSINT Engine failed: ${err.message}`, "api");
      }

      log(`[AUTOMATION] Step 4: Generating Judicial Advisory...`, "api");
      let courtReport = "";
      try {
        courtReport = threatEngine.generateCourtReport(policeCase, matches);
        log(`[AUTOMATION] Judicial Advisory generated.`, "api");
      } catch (err: any) {
        log(`[AUTOMATION_ERROR] Court Report generation failed: ${err.message}`, "api");
        courtReport = "Error generating report: " + err.message;
      }

      log(`[AUTOMATION] Step 5: Persisting Results to Ledger...`, "api");
      const updatedCase = await storage.updatePoliceCase(id, {
        automationData: JSON.stringify({
          matches,
          osint: osintResults
        }),
        courtReport: courtReport,
        status: (matches.length > 0 || osintResults.length > 0) ? "investigating" : policeCase.status,
        updatedAt: new Date().toISOString()
      });

      if (!updatedCase) {
        log(`[AUTOMATION_ERROR] Failed to update case record for ${id}`, "api");
        throw new Error("Failed to update case record after analysis.");
      }

      log(`[AUTOMATION] Investigation Bridge Complete for ${policeCase.firNumber}`, "api");
      res.json(updatedCase);
    } catch (error: any) {
      log(`[AUTOMATION_ERROR] Analysis failed for ${id}: ${error.message}`, "api");
      if (error.stack) log(error.stack, "api");
      res.status(500).json({
        message: "Internal Bridge Failure: " + error.message,
        details: error.stack
      });
    }
  });

  // Evidence API
  app.get("/api/police/cases/:caseId/evidence", async (req, res) => {
    try {
      const { caseId } = req.params;
      const evidence = await storage.getEvidence(caseId);
      log(`Serving ${evidence.length} evidence items for case ${caseId}`, "api");
      res.json(evidence);
    } catch (error: any) {
      log(`Evidence retrieval error: ${error.message}`, "api");
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/police/evidence", async (req, res) => {
    try {
      log(`Creating new evidence: ${req.body.evidenceType}`, "api");
      const evidence = await storage.createEvidence(req.body);
      res.status(201).json(evidence);
    } catch (error: any) {
      log(`Evidence creation error: ${error.message}`, "api");
      res.status(400).json({ message: error.message });
    }
  });

  // OSINT Enrichment API
  app.get("/api/osint/enrich/:query", async (req, res) => {
    try {
      const { query } = req.params;

      // Basic router for different artifact types
      if (query.includes("@")) {
        const data = await osintEngine.enrichEmail(query);
        return res.json(data);
      } else if (/^\d{10,12}$/.test(query.replace(/\+/g, ""))) {
        const data = await osintEngine.enrichPhone(query);
        return res.json(data);
      } else if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(query)) {
        const data = await osintEngine.enrichIp(query);
        return res.json(data);
      } else if (query.toLowerCase().endsWith(".apk")) {
        const data = await osintEngine.analyzeApk(query);
        return res.json(data);
      } else if (query.length > 8 && !query.includes(".")) {
        // Assume bank account/UPI if no other matches
        const data = await osintEngine.traceBank(query);
        return res.json(data);
      }

      res.status(400).json({ message: "Unsupported artifact type for real-time trace" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Wazuh API Local Proxy
  app.post("/api/wazuh/proxy", async (req, res) => {
    try {
      const { path, method, headers, body } = req.body;
      const https = (await import("https")).default;

      const options = {
        hostname: "localhost",
        port: 55000,
        path: path,
        method: method || "GET",
        headers: headers || {},
        rejectUnauthorized: false,
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = "";
        proxyRes.on("data", (chunk) => (data += chunk));
        proxyRes.on("end", () => {
          try {
            const json = JSON.parse(data);
            res.status(proxyRes.statusCode || 200).json(json);
          } catch (e) {
            // Some Wazuh endpoints like /authenticate?raw=true return plain text payload
            res.status(proxyRes.statusCode || 200).send(data);
          }
        });
      });

      proxyReq.on("error", (e) => {
        log(`Wazuh Connection Refused: ${e.message}`, "api");
        res.status(502).json({ error: "Wazuh Connection Refused", message: e.message });
      });

      if (body) {
        proxyReq.write(typeof body === "string" ? body : JSON.stringify(body));
      }
      proxyReq.end();
    } catch (err: any) {
      res.status(500).json({ error: "Proxy Exception", message: err.message });
    }
  });

  return httpServer;
}
