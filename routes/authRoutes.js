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

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/signup", registerUser);
router.post("/signin", loginUser);

// Protected
router.get("/profile", protect, getProfile);

// Admin
router.get("/users", protect, verifyAdmin, getAllUsers);
router.put("/users/:id/verify", protect, verifyAdmin, verifyUserAccount);
router.put("/users/:id/suspend", protect, verifyAdmin, toggleSuspendUserAccount);

export default router;
