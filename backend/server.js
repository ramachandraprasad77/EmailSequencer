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
      process.exit(1); // Only exit in non-production environments
    }
  });

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 MongoDB URI:", process.env.MONGO_URI);
}

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL?.split(",") || "*",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.get("/health", (req, res) => {
  res.status(200).json({ status: "✅ Server is healthy" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});