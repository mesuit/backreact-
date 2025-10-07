import express from "express";
import {
  getSubmissions,
  getUsers,
  postAssignment,
  verifyPayment,
  suspendUser,
  deleteUser,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes are protected + admin-only
router.get("/submissions", protect, adminOnly, getSubmissions);
router.get("/users", protect, adminOnly, getUsers);
router.post("/assignments", protect, adminOnly, postAssignment);
router.post("/verify-payment/:id", protect, adminOnly, verifyPayment);
router.post("/suspend-user/:id", protect, adminOnly, suspendUser);
router.delete("/delete-user/:id", protect, adminOnly, deleteUser);

export default router;
