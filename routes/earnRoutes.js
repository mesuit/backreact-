const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const earnController = require("../controllers/earnController");

// User profile & wallet
router.get("/me", authMiddleware, earnController.getProfile);

// Fetch assignments (local/international)
router.get("/assignments", authMiddleware, earnController.getAssignments);

// Accept an assignment
router.post("/assignments/:id/accept", authMiddleware, earnController.acceptAssignment);

// Start verification payment (demo)
router.post("/pay/verification", authMiddleware, earnController.startVerification);

module.exports = router;
