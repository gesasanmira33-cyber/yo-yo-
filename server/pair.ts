import fs from "fs";
import pino from "pino";
import {
  default as makeWASocket,
  useMultiFileAuthState,
  delay,
  makeCacheableSignalKeyStore,
  Browsers,
  jidNormalizedUser,
} from "@whiskeysockets/baileys";
import { uploadToMega } from "./mega";

function removeFile(FilePath: string) {
  if (!fs.existsSync(FilePath)) return false;
  fs.rmSync(FilePath, { recursive: true, force: true });
}

export async function startPairing(
  num: string, 
  onCodeReceived: (code: string) => void,
  onError: (err: any) => void
) {
  async function RobinPair() {
    const sessionDir = `./session`;
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    
    try {
      let RobinPairWeb = makeWASocket({
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(
            state.keys,
            pino({ level: "fatal" }).child({ level: "fatal" }) as any
          ),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }).child({ level: "fatal" }) as any,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        syncFullHistory: false,
        connectTimeoutMs: 120000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 30000,
        generateHighQualityLinkPreview: true,
        retryRequestDelayMs: 5000,
        markOnlineOnConnect: true,
        fireInitQueries: true,
        shouldSyncHistoryMessage: () => false,
        getMessage: async (key) => {
          return {
            conversation: 'Gesa Bot is active'
          }
        }
      });

      RobinPairWeb.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          // Existing logic...
        }
      });

      if (!RobinPairWeb.authState.creds.registered) {
        await delay(10000); 
        num = num.replace(/[^0-9]/g, "");
        const code = await RobinPairWeb.requestPairingCode(num);
        onCodeReceived(code);
      } else {
        // If already registered, we should probably clear and try again
        removeFile(sessionDir);
        onError(new Error("Session already exists, clearing... Try again."));
        return;
      }

      RobinPairWeb.ev.on("creds.update", saveCreds);
      RobinPairWeb.ev.on("connection.update", async (s) => {
        const { connection, lastDisconnect } = s;
        if (connection === "open") {
          try {
            await delay(10000);
            const user_jid = jidNormalizedUser(RobinPairWeb.user?.id || "");

            function randomMegaId(length = 6, numberLength = 4) {
              const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
              }
              const number = Math.floor(Math.random() * Math.pow(10, numberLength));
              return `${result}${number}`;
            }

            const mega_url = await uploadToMega(
              fs.createReadStream(sessionDir + "/creds.json"),
              `${randomMegaId()}.json`
            );

            const string_session = mega_url.replace("https://mega.nz/file/", "");

            const sid = `*Gesa [The powerful WA BOT]*\n\n👉 ${string_session} 👈\n\n*This is the your Session ID, copy this id and paste into config.js file*\n\n*You can ask any question using this link*\n\n*https://wa.me/94784525290*\n\n*You can join my whatsapp group*\n\n*https://chat.whatsapp.com/BFv2hknIIOdJEwHbWDai8D*`;
            const mg = `🛑 *Do not share this code to anyone* 🛑`;
            await RobinPairWeb.sendMessage(user_jid, {
              image: { url: "https://raw.githubusercontent.com/Dark-Robin/Bot-Helper/refs/heads/main/autoimage/Bot%20robin%20WP.jpg" },
              caption: sid,
            });
            await RobinPairWeb.sendMessage(user_jid, { text: string_session });
            await RobinPairWeb.sendMessage(user_jid, { text: mg });
          } catch (e) {
             console.error("Error in connection open", e);
          }

          await delay(100);
          removeFile(sessionDir);
        } else if (
          connection === "close" &&
          lastDisconnect &&
          (lastDisconnect.error as any)?.output?.statusCode !== 401
        ) {
          await delay(10000);
          RobinPair();
        }
      });
    } catch (err) {
      console.error("Pairing error", err);
      removeFile(sessionDir);
      onError(err);
    }
  }
  
  return await RobinPair();
}
