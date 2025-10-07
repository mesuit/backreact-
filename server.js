// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev frontend
      "https://assignment-orpin-pi-70.vercel.app", // deployed frontend on Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);

// Simple redirect
app.get("/humaniser", (req, res) => {
  res.redirect("https://humaniser-11.vercel.app/");
});

// Health check
app.get("/", (req, res) => {
  res.json({ message: "✅ Assignment Hub Backend is running!" });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong, please try again later." });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);


