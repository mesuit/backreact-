// controllers/adminController.js
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import News from "../models/News.js";
import bcrypt from "bcryptjs";

// ✅ USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Payment verified", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const revokePayment = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Verification revoked", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ SUBMISSIONS
export const getSubmissions = async (req, res) => {
  try {
    const subs = await Submission.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSubmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const sub = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!sub) return res.status(404).json({ error: "Submission not found" });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ASSIGNMENTS
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postAssignment = async (req, res) => {
  try {
    const { userId, title, content, type, link } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const assignment = await Assignment.create({
      userId: userId || null,
      title,
      content,
      type,
      link,
    });

    res.json({ message: "Assignment posted", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NEWS / UPDATES
export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postNews = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body)
      return res.status(400).json({ error: "Title and body required" });

    const item = await News.create({ title, body });
    res.json({ message: "News posted", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "News not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
