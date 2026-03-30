import { type User, type InsertUser, type Submission, type InsertSubmission, type CdocMetrics, type SecurityEvent, type P2PPeer, type Notification, type PoliceCase, type InsertPoliceCase, type Evidence, type InsertEvidence } from "@shared/schema";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { log } from "./utils";

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

  // Police Cases
  getPoliceCases(): Promise<PoliceCase[]>;
  getPoliceCase(id: string): Promise<PoliceCase | undefined>;
  createPoliceCase(policeCase: InsertPoliceCase): Promise<PoliceCase>;
  updatePoliceCase(id: string, updates: Partial<PoliceCase>): Promise<PoliceCase | undefined>;
  deletePoliceCase(id: string): Promise<boolean>;

  // Evidence
  getEvidence(caseId: string): Promise<Evidence[]>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private submissions: Map<string, Submission>;
  private metrics: CdocMetrics;
  private securityEvents: SecurityEvent[];
  private p2pPeers: P2PPeer[];
  private notifications: Notification[];
  private policeCases: Map<string, PoliceCase>;
  private evidence: Map<string, Evidence>;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.securityEvents = [];
    this.p2pPeers = [];
    this.notifications = [];
    this.policeCases = new Map();
    this.evidence = new Map();
    this.metrics = {
      id: "latest",
      threatLevel: "82",
      entropy: "92.4",
      signalStrength: "88.1",
      integrity: "99.9",
      timestamp: new Date().toISOString()
    };
    this.seed();
  }

  private seed() {
    const mockId = randomUUID();
    this.submissions.set(mockId, {
      id: mockId,
      cveId: "H3M4-2026-0812",
      title: "SQL Injection in Search Filter (Bypasses WAF)",
      category: "Web Application",
      researchType: "attack_technique",
      severity: "critical",
      cvssScore: "9.8",
      epssScore: "0.92",
      exploitability: "high",
      complexity: "low",
      description: "A blind SQL injection vulnerability exists in the 'filter' parameter of the search endpoint. It allows an attacker to dump the entire user database. The payload successfully bypasses the configured WAF rules...",
      impactAnalysis: "Full database exposure (PII), regulatory violation (GDPR).",
      affectedSystems: "Customer Search API, Production SQL cluster",
      poc: "poc_sql_inject.py",
      status: "verified",
      adminFeedback: "Confirmed by H3M4 Validator Node.",
      submittedAt: new Date().toISOString(),
      userId: "system",
      author: "acid_burn",
    });

    const mockId2 = randomUUID();
    this.submissions.set(mockId2, {
      id: mockId2,
      cveId: "H3M4-2026-4421",
      title: "Broken Access Control in Payment Gateway",
      category: "FinTech API",
      researchType: "vulnerability",
      severity: "high",
      cvssScore: "8.1",
      epssScore: "0.75",
      exploitability: "medium",
      complexity: "medium",
      description: "Insecure direct object reference (IDOR) allows unauthorized users to view and modify payment transactions of other customers by changing the payment_id in the URL.",
      impactAnalysis: "Financial data leakage, potential fund diversion.",
      affectedSystems: "Transaction Management Module",
      poc: "idor_repro.py",
      status: "verified",
      adminFeedback: "Valid finding. Sector-wide alert triggered.",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
      userId: "system",
      author: "zero_cool",
    });

    const mockId3 = randomUUID();
    this.submissions.set(mockId3, {
      id: mockId3,
      cveId: "H3M4-2026-9921",
      title: "RAT: Android.SmsSpy with UPI Interception",
      category: "Malware",
      researchType: "malware_analysis",
      severity: "critical",
      cvssScore: "9.0",
      epssScore: "0.88",
      exploitability: "high",
      complexity: "low",
      description: "New variant of Android RAT targeting Indian banking users. It intercepts SMS OTPs and overlays fake UPI payment screens to capture VPAs and Pins. Communicates with C2 at 103.45.67.89.",
      impactAnalysis: "Complete takeover of digital banking apps and UPI fund drainage.",
      affectedSystems: "Android Mobile Devices (v9-v14)",
      poc: "apk_signature_match.json",
      status: "verified",
      adminFeedback: "Critical analysis. Automated signatures distributed to banking nodes.",
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      userId: "system",
      author: "da_vinci",
    });

    const mockId4 = randomUUID();
    this.submissions.set(mockId4, {
      id: mockId4,
      cveId: "H3M4-2026-3312",
      title: "Phishing Kit: 'HDFC-Verify-Secure' Targeting Pan Cards",
      category: "Financial",
      researchType: "threat_actor",
      severity: "high",
      cvssScore: "7.5",
      epssScore: "0.65",
      exploitability: "high",
      complexity: "medium",
      description: "Active phishing campaign using SMS headers like 'INF-HDFC'. Captures PAN details, Bank logins, and 2FA. Data is exfiltrated to a compromised server at 192.168.1.100.",
      impactAnalysis: "Mass identity theft and unauthorized financial access.",
      affectedSystems: "Cloudflare Workers (hosting), SMS Gateways",
      poc: "kit_source_code.zip",
      status: "verified",
      adminFeedback: "Phishing URLs blacklisted globally.",
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      userId: "system",
      author: "crashed_system",
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

    // Seed Police Cases
    const case1Id = "case-1-fir-0234";
    this.policeCases.set(case1Id, {
      id: case1Id,
      firNumber: "FIR/2026/CYB/0234",
      caseTitle: "UPI Fraud - Multiple Victims",
      caseType: "fraud",
      status: "investigating",
      priority: "critical",
      assignedOfficer: "officer-1",
      victimDetails: "15 victims, ₹45 lakh total loss",
      suspectDetails: "Unknown, IP traced to 103.45.67.89",
      linkedThreats: JSON.stringify([mockId]),
      linkedIOCs: JSON.stringify(["103.45.67.89", "0x7a3f2b..."]),
      evidenceReports: JSON.stringify([]),
      courtStatus: null,
      courtReport: null,
      automationData: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
    });

    const case2Id = "case-2-fir-0198";
    this.policeCases.set(case2Id, {
      id: case2Id,
      firNumber: "FIR/2026/CYB/0198",
      caseTitle: "Ransomware Attack on Hospital",
      caseType: "ransomware",
      status: "open",
      priority: "high",
      assignedOfficer: "officer-2",
      victimDetails: "Municipal Hospital, 500+ patient records encrypted",
      suspectDetails: "Ransomware group 'DarkHackers', demand ₹1 crore",
      linkedThreats: JSON.stringify([]),
      linkedIOCs: JSON.stringify(["192.168.1.100", "malware.exe"]),
      evidenceReports: JSON.stringify([]),
      courtStatus: null,
      courtReport: null,
      automationData: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      closedAt: null,
    });

    const case3Id = "case-3-fir-0156";
    this.policeCases.set(case3Id, {
      id: case3Id,
      firNumber: "FIR/2026/CYB/0156",
      caseTitle: "Corporate Data Breach",
      caseType: "data_breach",
      status: "closed",
      priority: "medium",
      assignedOfficer: "officer-1",
      victimDetails: "TechCorp India, 10,000 customer records leaked",
      suspectDetails: "Arrested: Ramesh Kumar (ex-employee)",
      linkedThreats: JSON.stringify([]),
      linkedIOCs: JSON.stringify(["database-dump.sql"]),
      evidenceReports: JSON.stringify(["evidence-001.pdf"]),
      courtStatus: "convicted",
      courtReport: "Verified conviction for UPI fraud using H3M4 ledger validation.",
      automationData: null,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
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
    const generatedKey = `H3M4-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role ?? "researcher",
      badgeNumber: insertUser.badgeNumber ?? null,
      department: insertUser.department ?? null,
      securityKey: insertUser.securityKey || generatedKey
    };
    this.users.set(id, user);
    return user;
  }

  async createSubmission(insertSub: InsertSubmission): Promise<Submission> {
    const id = randomUUID();

    // Auto-calculate tech metrics if not provided
    const severityMap: Record<string, string> = { critical: "9.5", high: "7.8", medium: "5.0", low: "2.5" };
    const epssBase = insertSub.severity === "critical" ? 0.85 : 0.45;

    const submission: Submission = {
      id,
      cveId: `H3M4-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: insertSub.title,
      category: insertSub.category,
      researchType: insertSub.researchType,
      severity: insertSub.severity,
      cvssScore: insertSub.cvssScore ?? severityMap[insertSub.severity] ?? "5.0",
      epssScore: insertSub.epssScore ?? (epssBase + (Math.random() * 0.1)).toFixed(2),
      exploitability: insertSub.exploitability ?? (insertSub.severity === "critical" ? "high" : "medium"),
      complexity: insertSub.complexity ?? "low",
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

    return newEvent;
  }

  async getNotifications(): Promise<Notification[]> {
    return this.notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = "true";
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
    return newNotification;
  }

  // Police Cases Methods
  async getPoliceCases(): Promise<PoliceCase[]> {
    return Array.from(this.policeCases.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPoliceCase(id: string): Promise<PoliceCase | undefined> {
    const policeCase = this.policeCases.get(id);
    log(`[STORAGE] Fetching case ID: ${id} - Found: ${!!policeCase}`, "storage");
    return policeCase;
  }

  async createPoliceCase(insertCase: InsertPoliceCase): Promise<PoliceCase> {
    const id = randomUUID();
    const now = new Date().toISOString();

    // --- H3M4 AUTO-MAPPING INTELLIGENCE ENGINE ---
    console.log(`[H3M4] Initiating Intelligence Scan for FIR: ${insertCase.firNumber}`);

    // Scan all research submissions for "Intelligence Correlation"
    const allResearch = Array.from(this.submissions.values());
    const linkedThreatIds: string[] = [];
    const autoLinkedIOCs: string[] = [];

    // Search keywords from case title and victim details in research database
    // Using safer extraction with fallbacks to avoid split errors on nulls
    const titleWords = (insertCase.caseTitle || "").toLowerCase().split(/\s+/);
    const victimWords = (insertCase.victimDetails || "").toLowerCase().split(/\s+/);
    const suspectWords = (insertCase.suspectDetails || "").toLowerCase().split(/\s+/);

    const searchTerms = [
      ...titleWords,
      ...victimWords,
      ...suspectWords
    ].filter(word => word.length > 3);

    console.log(`[H3M4] Generated ${searchTerms.length} search tokens for correlation`);

    allResearch.forEach(sub => {
      const subContent = (
        (sub.title || "") + " " +
        (sub.description || "") + " " +
        (sub.affectedSystems || "")
      ).toLowerCase();

      // If research matches the case profile, auto-map it as evidence
      const isMatch = searchTerms.some(term => subContent.includes(term));
      if (isMatch) {
        console.log(`[H3M4] MATCH FOUND: Thread ${sub.id} correlated with case ${insertCase.firNumber}`);
        linkedThreatIds.push(sub.id);
        // If the sub has a PoC, consider it a confirmed technical loophole
        if (sub.poc) autoLinkedIOCs.push(`SCAN_LOOPHOLE_ID: ${sub.id.slice(0, 8)}`);
      }
    });

    // Extract potential IPs from suspect info for auto-mapping
    const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
    const suspectText = insertCase.suspectDetails || "";
    const foundIPs = suspectText.match(ipRegex) || [];
    foundIPs.forEach(ip => {
      if (!autoLinkedIOCs.includes(ip)) autoLinkedIOCs.push(ip);
    });

    console.log(`[H3M4] Mapping completed: ${linkedThreatIds.length} threats, ${autoLinkedIOCs.length} IOCs`);

    const policeCase: PoliceCase = {
      id,
      firNumber: insertCase.firNumber,
      caseTitle: insertCase.caseTitle,
      caseType: insertCase.caseType,
      status: insertCase.status ?? "open",
      priority: insertCase.priority ?? "medium",
      assignedOfficer: insertCase.assignedOfficer,
      victimDetails: insertCase.victimDetails ?? null,
      suspectDetails: insertCase.suspectDetails ?? null,
      linkedThreats: JSON.stringify(linkedThreatIds),
      linkedIOCs: JSON.stringify(autoLinkedIOCs),
      evidenceReports: null,
      courtStatus: null,
      courtReport: null,
      automationData: null,
      createdAt: now,
      updatedAt: now,
      closedAt: insertCase.closedAt ?? null,
    };
    this.policeCases.set(id, policeCase);

    // Create notifications for the "Intelligence Alignment"
    if (linkedThreatIds.length > 0) {
      await this.addNotification({
        message: `AUTO-MAPPED: ${linkedThreatIds.length} Research findings linked to FIR ${policeCase.firNumber}`,
        type: "success"
      });
    }

    await this.addNotification({
      message: `NEW FIR REGISTERED: ${policeCase.firNumber} - Intelligence Scan Complete`,
      type: "info"
    });

    // Create security event
    await this.addSecurityEvent({
      type: "POLICE_INTELLIGENCE_MAPPING",
      description: `Case ${policeCase.firNumber} mapped to ${linkedThreatIds.length} signals.`,
      severity: policeCase.priority === "critical" ? "HIGH" : "MEDIUM"
    });

    return policeCase;
  }

  async updatePoliceCase(id: string, updates: Partial<PoliceCase>): Promise<PoliceCase | undefined> {
    const policeCase = this.policeCases.get(id);
    if (!policeCase) return undefined;

    const updated = {
      ...policeCase,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.policeCases.set(id, updated);

    // If case is being closed, set closedAt
    if (updates.status === "closed" && !updated.closedAt) {
      updated.closedAt = new Date().toISOString();
    }

    return updated;
  }

  async deletePoliceCase(id: string): Promise<boolean> {
    return this.policeCases.delete(id);
  }

  // Evidence Methods
  async getEvidence(caseId: string): Promise<Evidence[]> {
    return Array.from(this.evidence.values())
      .filter(e => e.caseId === caseId)
      .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
  }

  async createEvidence(insertEvidence: InsertEvidence): Promise<Evidence> {
    const id = randomUUID();
    const evidence: Evidence = {
      id,
      caseId: insertEvidence.caseId,
      evidenceType: insertEvidence.evidenceType,
      description: insertEvidence.description,
      sourceUrl: insertEvidence.sourceUrl ?? null,
      documentHash: insertEvidence.documentHash ?? null,
      technicalData: insertEvidence.technicalData ?? null,
      collectedBy: insertEvidence.collectedBy,
      collectedAt: new Date().toISOString(),
      chainOfCustody: JSON.stringify([{
        action: "EVIDENCE_COLLECTED",
        officer: insertEvidence.collectedBy,
        timestamp: new Date().toISOString()
      }])
    };
    this.evidence.set(id, evidence);

    // Get the case to add to notification
    const policeCase = await this.getPoliceCase(insertEvidence.caseId);
    if (policeCase) {
      await this.addNotification({
        message: `New evidence added to ${policeCase.firNumber}: ${insertEvidence.evidenceType}`,
        type: "success"
      });
    }

    return evidence;
  }
}

export const storage = new MemStorage();
