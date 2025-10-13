// routes/earnRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  getUserEarnData,
  getAssignments,
  getAllAssignments,
  acceptAssignment,
  createAssignment,
} from "../controllers/earnController.js";

const router = express.Router();

// 🔒 User earnings data
router.get("/me", protect, getUserEarnData);

// 📘 User: available assignments
router.get("/assignments", protect, getAssignments);

// 🧑‍💼 Admin: get all assignments
router.get("/assignments/all", protect, getAllAssignments);

// 🧑‍💼 Admin: create new assignment (file/link/text)
router.post("/assignments/create", protect, upload.single("file"), createAssignment);

// 💼 User accepts an assignment
router.post("/assignments/:id/accept", protect, acceptAssignment);

export default router;

