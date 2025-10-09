const User = require("../models/User");
const Assignment = require("../models/Assignment");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      balance: user.wallet || 0,
      referrals: user.referrals || { count: 0, earnings: 0 },
      verified: user.verified || false,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const type = req.query.type || "local";
    const assignments = await Assignment.find({ type }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // mock payment process
    user.verified = true;
    await user.save();

    res.json({ message: "Verification complete (demo mode)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.acceptAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    const assignment = await Assignment.findById(id);

    if (!user.verified)
      return res.status(403).json({ error: "User not verified" });
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    assignment.assignedTo = user._id;
    await assignment.save();

    user.wallet = (user.wallet || 0) + (assignment.pay || 0);
    await user.save();

    res.json({ message: "Assignment accepted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
