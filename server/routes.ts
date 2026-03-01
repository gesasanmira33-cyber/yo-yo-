import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { startPairing } from "./pair";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.pairing.getCode.path, async (req, res) => {
    try {
      const { number } = req.query;
      
      if (!number || typeof number !== 'string') {
        return res.status(400).json({ message: "Number is required" });
      }

      // Record pairing attempt in storage
      await storage.createPairing({ number, code: "pending" });

      const code = await new Promise<string>((resolve, reject) => {
        startPairing(
          number, 
          (code) => resolve(code),
          (err) => reject(err)
        ).catch(reject);
      });

      res.status(200).json({ code });
      
    } catch (error: any) {
      console.error("Error generating code:", error);
      res.status(500).json({ message: error.message || "Failed to generate pairing code" });
    }
  });

  return httpServer;
}
