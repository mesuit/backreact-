import User from "../models/User.js";
import Assignment from "../models/Assignment.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      balance: user.wallet || 0,
      referrals: user.referrals || { count: 0, earnings: 0 },
      verified: user.isVerified || false,
    });
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const type = req.query.type || "local";
    const assignments = await Assignment.find({ type }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    console.error("getAssignments error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const startVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Mock verification (replace with M-Pesa or Stripe later)
    user.isVerified = true;
    await user.save();

    res.json({ message: "Verification successful (demo mode)" });
  } catch (err) {
    console.error("startVerification error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const assignment = await Assignment.findById(id);

    if (!user.isVerified)
      return res.status(403).json({ error: "User not verified" });
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    assignment.assignedTo = user._id;
    await assignment.save();

    user.wallet = (user.wallet || 0) + (assignment.pay || 0);
    await user.save();

    res.json({ message: "Assignment accepted successfully" });
  } catch (err) {
    console.error("acceptAssignment error:", err);
    res.status(500).json({ error: err.message });
  }
};
