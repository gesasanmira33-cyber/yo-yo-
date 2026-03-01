import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pairings = pgTable("pairings", {
  id: serial("id").primaryKey(),
  number: text("number").notNull(),
  code: text("code").notNull(),
});

export const insertPairingSchema = createInsertSchema(pairings).omit({ id: true });
export type InsertPairing = z.infer<typeof insertPairingSchema>;
export type Pairing = typeof pairings.$inferSelect;
