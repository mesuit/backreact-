import express from "express";
import { submitAssignment, getAssignments } from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitAssignment);
router.get("/", protect, getAssignments);

export default router;
