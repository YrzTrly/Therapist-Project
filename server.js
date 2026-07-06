import express from "express";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import { initDb } from "./db/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

// Directive 1.1: Strict CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(express.json());

// Directive 1.2: Global Request Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per `window` (here, per minute)
  message: {
    error: "Too many requests from this IP, please try again after a minute",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use("/api", globalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Serve frontend static files when available (production build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = path.join(__dirname, "frontend", "dist");

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// Directive 4.2: Catch-All 4-parameter Error Handler
app.use((err, req, res, next) => {
  // Log the detailed stack trace securely on the server console
  console.error("Unhandled Error:", err.stack);

  // Return a clean, uncompromised 500 status response to the client
  res.status(500).json({ error: "Internal Server Error" });
});

async function startServer() {
  try {
    await initDb();
    console.log("Database initialized successfully.");

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
