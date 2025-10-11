import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  suspendUserAccount,
  verifyUserAccount,
  getAllUsers, // ✅ new
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

// Admin Only
router.get("/users", protect, verifyAdmin, getAllUsers); // ✅ new route
router.put("/suspend/:id", protect, verifyAdmin, suspendUserAccount);
router.put("/verify/:id", protect, verifyAdmin, verifyUserAccount);

export default router;
