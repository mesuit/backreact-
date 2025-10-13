import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserEarnData,
  getAssignments,
  getAllAssignments,
  acceptAssignment,
  createAssignment,
} from "../controllers/earnController.js";

const router = express.Router();

// 🔒 User profile data (earnings, progress)
router.get("/me", protect, getUserEarnData);

// 📘 Public / User accessible: get available assignments
router.get("/assignments", protect, getAssignments);

// 🧑‍💼 Admin: get all assignments (for management dashboard)
router.get("/assignments/all", protect, getAllAssignments);

// 🧑‍💼 Admin: create new assignment (with file/link/text)
router.post("/assignments/create", protect, createAssignment);

// 💼 User accepts an assignment
router.post("/assignments/:id/accept", protect, acceptAssignment);

export default router;
