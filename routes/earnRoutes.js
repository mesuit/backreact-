import express from "express";
import {
  getProfile,
  getAssignments,
  acceptAssignment,
  startVerification,
} from "../controllers/earnController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/earn/me → fetch user wallet + referral + verification info
router.get("/me", protect, getProfile);

// GET /api/earn/assignments?type=local → fetch assignments
router.get("/assignments", protect, getAssignments);

// POST /api/earn/assignments/:id/accept → accept an assignment
router.post("/assignments/:id/accept", protect, acceptAssignment);

// POST /api/earn/pay/verification → start verification payment
router.post("/pay/verification", protect, startVerification);

export default router;
