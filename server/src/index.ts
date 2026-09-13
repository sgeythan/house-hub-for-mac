import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import path from "node:path";
import { WebSocketServer } from "ws";
import { HOST, PORT, WEB_DIST, lanAddresses } from "./config.ts";
import { bootHub, registerSocket } from "./hub.ts";
import { router } from "./routes.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (!existsSync(WEB_DIST)) return next();
  express.static(WEB_DIST)(req, res, next);
});
app.get("*", (req, res, next) => {
  const index = path.join(WEB_DIST, "index.html");
  if (!existsSync(index) || req.path.startsWith("/api")) return next();
  res.sendFile(index);
});

const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket, req) => {
  const ip = req.socket.remoteAddress || "unknown";
  console.log(`WebSocket connected from ${ip}`);
  registerSocket(socket, ip);
});

process.on("uncaughtException", (err) => {
  if (err instanceof Error && err.message.includes("EADDRINUSE")) {
    console.error("Port 8787 is already in use. Stop the other House Hub and try again.");
    process.exit(1);
  }
  console.error("Hub stayed up after error:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("Hub stayed up after rejection:", err);
});

server.on("error", (err) => {
  console.error("Hub server error:", err.message);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  const lan = lanAddresses()[0] || "127.0.0.1";
  console.log(`House hub listening on http://localhost:${PORT}`);
  console.log(`LAN dashboard http://${lan}:${PORT}`);
  console.log(`LAN API / WebSocket ws://${lan}:${PORT}/ws`);
  void bootHub().catch((err) => {
    console.error("Hub boot failed:", err);
  });
});
