import { pairings, type Pairing, type InsertPairing } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPairing(id: number): Promise<Pairing | undefined>;
  createPairing(pairing: InsertPairing): Promise<Pairing>;
}

export class DatabaseStorage implements IStorage {
  async getPairing(id: number): Promise<Pairing | undefined> {
    const [pairing] = await db.select().from(pairings).where(eq(pairings.id, id));
    return pairing;
  }

  async createPairing(insertPairing: InsertPairing): Promise<Pairing> {
    const [pairing] = await db.insert(pairings).values(insertPairing).returning();
    return pairing;
  }
}

export const storage = new DatabaseStorage();
