import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("researcher"), // admin, researcher, enterprise, police
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  badgeNumber: text("badgeNumber"), // For police officers
  department: text("department"), // Police department/unit
  securityKey: text("securityKey").notNull(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cveId: text("cve_id"), // Custom H3M4-ID or mapped CVE
  title: text("title").notNull(),
  category: text("category").notNull(),
  researchType: text("researchType").notNull(),
  severity: text("severity").notNull(),
  cvssScore: text("cvss_score"), // 0.0 - 10.0
  epssScore: text("epss_score"), // Probability of exploit
  exploitability: text("exploitability"), // high, medium, low
  complexity: text("complexity"), // high, medium, low
  description: text("description").notNull(),
  impactAnalysis: text("impactAnalysis"),
  affectedSystems: text("affectedSystems"),
  poc: text("poc"),
  status: text("status").notNull().default("pending"), // pending, verified, rejected
  adminFeedback: text("adminFeedback"), // For corrections/comments from admin
  submittedAt: text("submittedAt").notNull().default(sql`CURRENT_TIMESTAMP`),
  userId: varchar("userId").notNull(),
  author: text("author").notNull(),
});

// Police Cases - Investigation management
export const policeCases = pgTable("police_cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firNumber: text("fir_number").notNull().unique(), // First Information Report number
  caseTitle: text("case_title").notNull(),
  caseType: text("case_type").notNull(), // fraud, ransomware, data_breach, etc.
  status: text("status").notNull().default("open"), // open, investigating, closed, convicted
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  assignedOfficer: varchar("assigned_officer").notNull(), // User ID of police officer
  victimDetails: text("victim_details"),
  suspectDetails: text("suspect_details"),
  linkedThreats: text("linked_threats"), // JSON array of threat IDs
  linkedIOCs: text("linked_iocs"), // JSON array of IOCs
  evidenceReports: text("evidence_reports"), // JSON array of evidence documents
  courtStatus: text("court_status"), // filed, hearing, verdict
  courtReport: text("court_report"), // Automated detailed analysis for court
  automationData: text("automation_data"), // Researcher intel matches & remediation
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  closedAt: text("closed_at"),
});

// Evidence items linked to cases
export const evidence = pgTable("evidence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseId: varchar("case_id").notNull(),
  evidenceType: text("evidence_type").notNull(), // technical_report, call_logs, bank_account, phishing_domain, wifi_logs
  description: text("description").notNull(),
  technicalData: text("technical_data"), // JSON for specific logs (numbers, account IDs)
  sourceUrl: text("source_url"), // Link to threat signal or submission
  documentHash: text("document_hash"), // SHA256 hash for integrity
  collectedBy: varchar("collected_by").notNull(), // Officer ID
  collectedAt: text("collected_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  chainOfCustody: text("chain_of_custody"), // JSON log of who accessed/modified
});

export const cdocMetrics = pgTable("cdoc_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threatLevel: text("threatLevel").notNull(),
  entropy: text("entropy").notNull(),
  signalStrength: text("signalStrength").notNull(),
  integrity: text("integrity").notNull(),
  timestamp: text("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const securityEvents = pgTable("security_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // ATTACK, PURGE, LOCKDOWN
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  timestamp: text("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const p2pPeers = pgTable("p2p_peers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  peerId: text("peerId").notNull(),
  hash: text("hash").notNull(),
  isp: text("isp").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  reputation: text("reputation").notNull(),
  timestamp: text("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  type: text("type").notNull(), // alert, info, success, warning
  isRead: text("isRead").notNull().default("false"),
  timestamp: text("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true }).extend({
  securityKey: z.string().optional(),
});
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true });
export const insertPoliceCaseSchema = createInsertSchema(policeCases).omit({ id: true });
export const insertEvidenceSchema = createInsertSchema(evidence).omit({ id: true });
export const insertCdocMetricsSchema = createInsertSchema(cdocMetrics).omit({ id: true });
export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({ id: true });
export const insertP2PPeerSchema = createInsertSchema(p2pPeers).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type PoliceCase = typeof policeCases.$inferSelect;
export type InsertPoliceCase = z.infer<typeof insertPoliceCaseSchema>;
export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type CdocMetrics = typeof cdocMetrics.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type P2PPeer = typeof p2pPeers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
