// src/routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  suspendUserAccount,
  verifyUserAccount,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.post("/signin", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);

// Admin only
router.get("/users", protect, verifyAdmin, getAllUsers);
router.put("/users/:id/verify", protect, verifyAdmin, verifyUserAccount);
router.put("/users/:id/suspend", protect, verifyAdmin, suspendUserAccount);

export default router;
