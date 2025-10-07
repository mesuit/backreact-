import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import User from "../models/User.js";

// 📌 Get all user submissions
export const getSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find().populate("userId", "email name");
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

// 📌 Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// 📌 Post an assignment to a user
export const postAssignment = async (req, res) => {
  try {
    const { userId, type, title, content, link } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ message: "User and Title required" });
    }

    const assignment = new Assignment({
      userId,
      type,
      title,
      content,
      link,
    });

    await assignment.save();
    res.json({ message: "Assignment posted successfully", assignment });
  } catch (err) {
    res.status(500).json({ message: "Failed to post assignment" });
  }
};

// 📌 Verify user payment
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

// 📌 Suspend a user
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

// 📌 Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
