import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  verifyUserAccount,
  suspendUserAccount,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* 🧩 Public Authentication Routes */
router.post("/register", registerUser);
router.post("/login", loginUser);

// Aliases (frontend compatibility)
router.post("/signup", registerUser);
router.post("/signin", loginUser);

/* 🔐 Protected User Profile */
router.get("/profile", protect, getProfile);

/* 🛡️ Admin Routes for Managing Users */
router.post("/users/:id/verify", protect, adminOnly, verifyUserAccount);
router.post("/users/:id/suspend", protect, adminOnly, suspendUserAccount);

export default router;
