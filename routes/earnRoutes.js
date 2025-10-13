import express from "express";
import { protect, verifyAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js"; // ✅ FIXED

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
router.get("/assignments/all", protect, verifyAdmin, getAllAssignments);

// 🧑‍💼 Admin: create new assignment (file/link/text)
router.post(
  "/assignments/create",
  protect,
  verifyAdmin,
  upload.single("file"), // ✅ Now this works fine
  createAssignment
);

// 💼 User accepts an assignment
router.post("/assignments/:id/accept", protect, acceptAssignment);

export default router;
