import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import User from "./models/User.js";

dotenv.config();

// ===============================
// ✅ Connect DB + Auto-create admin
// ===============================
connectDB().then(() => createAdmin());

const app = express();

// ===============================
// ✅ CORS Setup
// ===============================
const allowedOrigins = [
  "http://localhost:3000",
  "https://assignment-orpin-pi-70.vercel.app",
  "https://react-gamma-brown-25.vercel.app", // ✅ added new frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman / server requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight OPTIONS requests
app.options("*", cors());

// ===============================
// ✅ Middleware
// ===============================
app.use(express.json());

// ===============================
// ✅ Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/humaniser", (req, res) => {
  res.redirect("https://humaniser-11.vercel.app/");
});

// Health check route
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

// ===============================
// ✅ Start server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ===============================
// ✅ Auto-create Admin if not exists
// ===============================
async function createAdmin() {
  try {
    const { ADMIN_EMAIL, ADMIN_PASS } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASS) {
      console.warn("⚠️ ADMIN_EMAIL or ADMIN_PASS not set in .env");
      return;
    }

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin already exists ✅");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);

    const admin = new User({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    console.log("Admin created successfully ✅");
  } catch (err) {
    console.error("Error creating admin:", err);
  }
}
