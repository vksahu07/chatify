import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import adminRoutes from "./routes/admin.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [ENV.CLIENT_URL, "https://vksahu07.github.io"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

if (ENV.NODE_ENV === "production") {
  const frontendDist = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendDist, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}
server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
