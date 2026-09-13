import dotenv from "dotenv";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const here = path.dirname(fileURLToPath(import.meta.url));

export const ROOT_DIR = path.resolve(here, "../..");
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const STATE_FILE = path.join(DATA_DIR, "state.json");
export const WEB_DIST = path.join(ROOT_DIR, "web", "dist");

export const PORT = Number(process.env.PORT || 8787);
export const HOST = process.env.HOST || "0.0.0.0";

export function lanAddresses(): string[] {
  const found: string[] = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const item of list || []) {
      const ipv4 = item.family === "IPv4" || item.family === 4;
      if (ipv4 && !item.internal) found.push(item.address);
    }
  }
  return found;
}
