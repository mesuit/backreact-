// routes/earnRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserEarnData,
  getAssignments,
  acceptAssignment,
} from "../controllers/earnController.js";

const router = express.Router();

router.get("/me", protect, getUserEarnData);
router.get("/assignments", protect, getAssignments);
router.post("/assignments/:id/accept", protect, acceptAssignment);

export default router;
