import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const replyHistoryTable = pgTable("reply_history", {
  id: serial("id").primaryKey(),
  conversationSnippet: text("conversation_snippet").notNull(),
  mode: text("mode").notNull(),
  reply: text("reply").notNull(),
  interestLevel: integer("interest_level").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReplyHistorySchema = createInsertSchema(replyHistoryTable).omit({ id: true, createdAt: true });
export type InsertReplyHistory = z.infer<typeof insertReplyHistorySchema>;
export type ReplyHistory = typeof replyHistoryTable.$inferSelect;
