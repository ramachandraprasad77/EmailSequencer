import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables early

const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
connectToDatabase()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️ Continuing server startup despite DB failure...")
    }
  });

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 MongoDB URI:", process.env.MONGO_URI);
}

// Middleware
const allowedOrigins = [
  "https://prasad-emailsequencer.netlify.app",
  process.env.NODE_ENV !== "production" ? "http://localhost:3000" : null
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.get("/health", async (req, res) => {
  try {
    await connectToDatabase(); // Ensures DB is accessible
    res.status(200).json({ status: "✅ Server is healthy", db: "Connected" });
  } catch (error) {
    res.status(500).json({ status: "❌ Server has issues", db: "Failed" });
  }
});

// Start Server
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" })
  ],
});

logger.info(`🚀 Server running on port ${PORT}`);
