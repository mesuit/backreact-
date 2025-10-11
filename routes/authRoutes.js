// src/routes/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  suspendUserAccount,
  verifyUserAccount,
} from "../controllers/authController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================
// Public Routes
// =====================
router.post("/register", registerUser);
router.post("/login", loginUser);

// Aliases for compatibility
router.post("/signup", registerUser);
router.post("/signin", loginUser);

// =====================
// Protected Routes
// =====================
router.get("/profile", protect, getProfile);

// =====================
// Admin Only Routes
// =====================
router.put("/suspend/:id", protect, verifyAdmin, suspendUserAccount);
router.put("/verify/:id", protect, verifyAdmin, verifyUserAccount);

// =====================
// Export Router (ES Module)
// =====================
export default router;
