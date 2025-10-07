import express from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Original routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Aliases (so frontend calls like /signup and /signin still work)
router.post("/signup", registerUser);
router.post("/signin", loginUser);

// Protected route to get user profile
router.get("/profile", protect, getProfile);

export default router;
