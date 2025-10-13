// controllers/earnController.js
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// GET /api/earn/me
export const getUserEarnData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      balance: user.balance || 0,
      referrals: user.referrals || { count: 0, points: 0 },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error loading earn data" });
  }
};

// GET /api/earn/assignments?type=local
export const getAssignments = async (req, res) => {
  try {
    const { type } = req.query;
    const assignments = await Assignment.find(type ? { type } : {});
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching assignments" });
  }
};

// POST /api/earn/assignments/:id/accept
export const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    res.json({
      message: `You accepted "${assignment.title}". Check your email for submission instructions.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error accepting assignment" });
  }
};
