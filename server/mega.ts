import { Storage } from "megajs";
import type { ReadStream } from "fs";

const auth = {
  email: "gesandsanmira19202@gmail.com",
  password: "Gesandu!@#123",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
};

export const uploadToMega = (data: ReadStream, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // We use type assertion because megajs types might differ slightly
    const storage = new (Storage as any)(auth);

    storage.on("ready", () => {
      console.log("Storage is ready. Proceeding with upload.");

      const uploadStream = storage.upload({ name, allowUploadBuffering: true });

      uploadStream.on("complete", (file: any) => {
        file.link((err: any, url: string) => {
          if (err) {
            reject(err);
          } else {
            storage.close();
            resolve(url);
          }
        });
      });

      uploadStream.on("error", (err: any) => {
        reject(err);
      });

      data.pipe(uploadStream);
    });

    storage.on("error", (err: any) => {
      reject(err);
    });
  });
};
