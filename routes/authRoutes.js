import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  toggleSuspendUserAccount,
  verifyUserAccount,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// --------------------
// Public Routes
// --------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// Aliases
router.post("/signup", registerUser);
router.post("/signin", loginUser);

// --------------------
// Protected Routes
// --------------------
router.get("/profile", protect, getProfile);

// --------------------
// Admin Only Routes
// --------------------
router.get("/users", protect, verifyAdmin, getAllUsers);
router.put("/users/:id/verify", protect, verifyAdmin, verifyUserAccount);
router.put("/users/:id/suspend", protect, verifyAdmin, toggleSuspendUserAccount);

export default router;
