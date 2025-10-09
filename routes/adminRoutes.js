// routes/adminRoutes.js
import express from "express";
import {
  getUsers,
  verifyPayment,
  revokePayment,
  addUser,
  getSubmissions,
  updateSubmissionStatus,
  getAssignments,
  postAssignment,
  deleteAssignment,
  getNews,
  postNews,
  deleteNews,
} from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes protected
router.use(verifyToken, verifyAdmin);

// 👤 User management
router.get("/users", getUsers);
router.post("/add-user", addUser);
router.post("/verify-payment/:id", verifyPayment);
router.post("/revoke-payment/:id", revokePayment);

// 📝 Submissions
router.get("/submissions", getSubmissions);
router.post("/submission-status/:id", updateSubmissionStatus);

// 📚 Assignments
router.get("/assignments", getAssignments);
router.post("/post-assignment", postAssignment);
router.delete("/assignments/:id", deleteAssignment);

// 📰 News / Updates
router.get("/news", getNews);
router.post("/post-news", postNews);
router.delete("/news/:id", deleteNews);

export default router;

