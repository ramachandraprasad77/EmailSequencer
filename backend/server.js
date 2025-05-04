import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import cors from "cors";
import connectToDatabase from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";
import { agendaReady } from "./config/agenda.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure database connection is successful before starting the server
connectToDatabase().catch((error) => {
  console.error("❌ Database connection failed:", error.message);
  process.exit(1); // Stop the server if DB connection fails
});

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 MongoDB URI:", process.env.MONGO_URI);
}

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/email", emailRoutes);

//  Health Check Route for API Monitoring
app.get("/health", (req, res) => {
  res.status(200).json({ status: "✅ Server is healthy" });
});

//  Start Server only after Agenda is ready
agendaReady.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});