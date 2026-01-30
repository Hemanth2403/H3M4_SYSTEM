import { type User, type InsertUser, type Submission, type InsertSubmission, type CdocMetrics, type SecurityEvent, type P2PPeer, type Notification } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Submissions
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(): Promise<Submission[]>;
  updateSubmissionStatus(id: string, status: string, feedback?: string): Promise<Submission | undefined>;

  // CDOC
  getCdocMetrics(): Promise<CdocMetrics>;
  getSecurityEvents(): Promise<SecurityEvent[]>;
  getP2PPeers(): Promise<P2PPeer[]>;
  addSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): Promise<SecurityEvent>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
  addNotification(notification: Omit<Notification, "id" | "isRead" | "timestamp">): Promise<Notification>;
}

export class FileStorage implements IStorage {
  private users: Map<string, User>;
  private submissions: Map<string, Submission>;
  private metrics: CdocMetrics;
  private securityEvents: SecurityEvent[];
  private p2pPeers: P2PPeer[];
  private notifications: Notification[];
  private filePath: string;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.securityEvents = [];
    this.p2pPeers = [];
    this.notifications = [];
    this.metrics = {
      id: "latest",
      threatLevel: "82",
      entropy: "92.4",
      signalStrength: "88.1",
      integrity: "99.9",
      timestamp: new Date().toISOString()
    };
    this.filePath = path.resolve(process.cwd(), "storage.json");
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
        if (data.users) {
          data.users.forEach((u: User) => this.users.set(u.id, u));
        }
        if (data.submissions) {
          data.submissions.forEach((s: Submission) => this.submissions.set(s.id, s));
        }
        if (data.securityEvents) {
          this.securityEvents = data.securityEvents;
        }
        if (data.p2pPeers) {
          this.p2pPeers = data.p2pPeers;
        }
        if (data.metrics) {
          this.metrics = data.metrics;
        }
        if (data.notifications) {
          this.notifications = data.notifications;
        }
        console.log(`[Storage] Loaded data from ${this.filePath}`);
      } else {
        console.log("[Storage] No existing storage file. Initializing with mock data.");
        this.seed();
        this.save();
      }
    } catch (err) {
      console.error("[Storage] Failed to load data:", err);
      this.seed();
      this.save();
    }
  }

  private seed() {
    const mockId = randomUUID();
    this.submissions.set(mockId, {
      id: mockId,
      title: "SQL Injection in Search Filter (Bypasses WAF)",
      category: "Web Application",
      researchType: "attack_technique",
      severity: "critical",
      description: "A blind SQL injection vulnerability exists in the 'filter' parameter of the search endpoint. It allows an attacker to dump the entire user database. The payload successfully bypasses the configured WAF rules...",
      impactAnalysis: "Full database exposure (PII), regulatory violation (GDPR).",
      affectedSystems: "Customer Search API, Production SQL cluster",
      poc: "poc_sql_inject.py",
      status: "pending",
      adminFeedback: null,
      submittedAt: new Date().toISOString(),
      userId: "system",
      author: "acid_burn",
    });

    // Seed P2P Peers
    const isps = ["Cloudflare", "DigitalOcean", "AWS", "Google Cloud", "Akamai"];
    const types = ["P2P_NODE", "RELAY", "VALIDATOR", "INBOUND_RPC"];
    for (let i = 0; i < 10; i++) {
      this.p2pPeers.push({
        id: randomUUID(),
        peerId: Math.random().toString(16).substring(2, 8).toUpperCase(),
        hash: `0x${Math.random().toString(16).substring(2, 10)}`,
        isp: isps[Math.floor(Math.random() * isps.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: Math.random() > 0.15 ? 'VALID' : 'SUSPICIOUS',
        reputation: Math.floor(Math.random() * 100).toString(),
        timestamp: new Date().toISOString()
      });
    }

    // Seed Security Events
    this.securityEvents.push({
      id: randomUUID(),
      type: "ATTACK",
      description: "Inbound RPC flood detected on Shard #882",
      severity: "HIGH",
      timestamp: new Date().toISOString()
    });

    // Seed Notifications
    this.notifications.push(
      { id: randomUUID(), message: "High-priority threat detected in AWS", type: "alert", isRead: "false", timestamp: new Date().toISOString() },
      { id: randomUUID(), message: "New research submission pending review", type: "info", isRead: "false", timestamp: new Date().toISOString() },
      { id: randomUUID(), message: "Compliance report generated for Global Bank", type: "success", isRead: "false", timestamp: new Date().toISOString() }
    );
  }

  private save() {
    try {
      const data = {
        users: Array.from(this.users.values()),
        submissions: Array.from(this.submissions.values()),
        securityEvents: this.securityEvents,
        p2pPeers: this.p2pPeers,
        metrics: this.metrics,
        notifications: this.notifications
      };
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("[Storage] Failed to save data:", err);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role ?? "researcher"
    };
    this.users.set(id, user);
    this.save();
    return user;
  }

  async createSubmission(insertSub: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      id,
      title: insertSub.title,
      category: insertSub.category,
      researchType: insertSub.researchType,
      severity: insertSub.severity,
      description: insertSub.description,
      impactAnalysis: insertSub.impactAnalysis ?? null,
      affectedSystems: insertSub.affectedSystems ?? null,
      poc: insertSub.poc ?? null,
      status: "pending",
      adminFeedback: null,
      submittedAt: new Date().toISOString(),
      userId: insertSub.userId,
      author: insertSub.author,
    };
    this.submissions.set(id, submission);

    await this.addNotification({
      message: `NEW RESEARCH: ${submission.title} by ${submission.author}`,
      type: "info"
    });

    await this.addSecurityEvent({
      type: "INTEL_SUBMISSION",
      description: `New research protocol uploaded: ${submission.title}`,
      severity: submission.severity === "critical" ? "HIGH" : "MEDIUM"
    });

    this.save();
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  async updateSubmissionStatus(id: string, status: string, feedback?: string): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;

    const updated = { ...submission, status, adminFeedback: feedback ?? submission.adminFeedback };
    this.submissions.set(id, updated);
    this.save();
    return updated;
  }

  async getCdocMetrics(): Promise<CdocMetrics> {
    // Simulate real-time variation
    return {
      ...this.metrics,
      threatLevel: (Math.max(70, Math.min(98, parseInt(this.metrics.threatLevel) + (Math.random() > 0.5 ? 1 : -1)))).toString(),
      timestamp: new Date().toISOString()
    };
  }

  async getSecurityEvents(): Promise<SecurityEvent[]> {
    return this.securityEvents.slice(-20).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getP2PPeers(): Promise<P2PPeer[]> {
    // Regenerate list occasionally for "reality"
    if (Math.random() > 0.7) {
      const isps = ["Cloudflare", "DigitalOcean", "AWS", "Google Cloud", "Akamai"];
      const types = ["P2P_NODE", "RELAY", "VALIDATOR", "INBOUND_RPC"];
      const newPeer = {
        id: randomUUID(),
        peerId: Math.random().toString(16).substring(2, 8).toUpperCase(),
        hash: `0x${Math.random().toString(16).substring(2, 10)}`,
        isp: isps[Math.floor(Math.random() * isps.length)],
        type: types[Math.floor(Math.random() * types.length)],
        status: Math.random() > 0.15 ? 'VALID' : 'SUSPICIOUS',
        reputation: Math.floor(Math.random() * 100).toString(),
        timestamp: new Date().toISOString()
      };
      this.p2pPeers = [newPeer, ...this.p2pPeers.slice(0, 14)];
    }
    return this.p2pPeers;
  }

  async addSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp">): Promise<SecurityEvent> {
    const newEvent = {
      ...event,
      id: randomUUID(),
      timestamp: new Date().toISOString()
    };
    this.securityEvents.push(newEvent);

    // Automatically create a notification for this event
    await this.addNotification({
      message: `${newEvent.type}: ${newEvent.description}`,
      type: newEvent.severity === "HIGH" ? "alert" : "warning"
    });

    this.save();
    return newEvent;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = "true";
      this.save();
    }
  }

  async addNotification(notification: Omit<Notification, "id" | "isRead" | "timestamp">): Promise<Notification> {
    const newNotification = {
      ...notification,
      id: randomUUID(),
      isRead: "false",
      timestamp: new Date().toISOString()
    };
    this.notifications.push(newNotification);
    this.save();
    return newNotification;
  }
}

export const storage = new FileStorage();
