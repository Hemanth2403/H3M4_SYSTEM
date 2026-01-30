import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("researcher"), // admin, researcher, enterprise
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  researchType: text("researchType").notNull(),
  severity: text("severity").notNull(),
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

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertSubmissionSchema = createInsertSchema(submissions).omit({ id: true });
export const insertCdocMetricsSchema = createInsertSchema(cdocMetrics).omit({ id: true });
export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({ id: true });
export const insertP2PPeerSchema = createInsertSchema(p2pPeers).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type CdocMetrics = typeof cdocMetrics.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type P2PPeer = typeof p2pPeers.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
