import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// Get all submissions (both submitted assignments and assigned ones)
export const getSubmissions = async (req, res) => {
  try {
    const subs = await Assignment.find()
      .populate("submittedBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Post an assignment to a user
export const postAssignment = async (req, res) => {
  const { userId, type, title, content, link, department } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  try {
    const assignment = new Assignment({
      assignedTo: userId || null,
      type: type || "local",
      title,
      description: content,
      link: link || "",
      department: department || "general"
    });
    await assignment.save();
    res.json({ message: "Assignment posted successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: "Failed to post assignment" });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();
    res.json({ message: "User payment verified", user });
  } catch (err) {
    res.status(500).json({ message: "Error verifying payment" });
  }
};

// Suspend a user
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = true;
    await user.save();
    res.json({ message: "User suspended", user });
  } catch (err) {
    res.status(500).json({ message: "Error suspending user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally delete assignments submitted by this user
    await Assignment.deleteMany({ submittedBy: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

