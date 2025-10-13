import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import earnRoutes from "./routes/earnRoutes.js"; // 👈 NEW (Learn & Earn)

// Models
import User from "./models/User.js";

dotenv.config();

const app = express();

// ===============================
// ✅ Robust CORS Setup
// ===============================
const allowedOrigins = [
  "https://react-ho29.onrender.com",
  "https://react-uj2w.vercel.app",
  "https://react-dun-six-42.vercel.app",
  "http://localhost:3000",
  "https://assignment-orpin-pi-70.vercel.app",
  "https://react-gamma-brown-25.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests (Postman, curl)
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Handle preflight OPTIONS requests globally
app.options("*", cors());

// ===============================
// ✅ Middleware
// ===============================
app.use(express.json());

// ===============================
// ✅ Connect DB + Auto-create admin
// ===============================
connectDB()
  .then(() => createAdmin())
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// ===============================
// ✅ Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/earn", earnRoutes); // 👈 NEW route for Learn & Earn system

// ✅ Frontend redirection
app.get("/humaniser", (req, res) => {
  res.redirect("https://humaniser-11.vercel.app/");
});

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "✅ Assignment Hub Backend is running!" });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong, please try again later.",
  });
});

// ===============================
// ✅ Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

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
      console.log("✅ Admin already exists:", ADMIN_EMAIL);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASS, 10);

    const admin = new User({
      name: "Super Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isVerified: true,
    });

    await admin.save();
    console.log(`✅ Admin created successfully: ${ADMIN_EMAIL}`);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}
