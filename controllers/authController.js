import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================================
// ✅ Generate JWT Token (includes ID + Role)
// =======================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// =======================================
// ✅ Register a New User
// =======================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    let role = "student";
    let isAdmin = false;

    if (email === process.env.ADMIN_EMAIL) {
      role = "admin";
      isAdmin = true;
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      isAdmin,
      isVerified: true,
      isSuspended: false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// =======================================
// ✅ Login Existing User
// =======================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found. Please register." });

    if (user.isSuspended)
      return res.status(403).json({ message: "Account suspended. Contact admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// =======================================
// ✅ Get Logged-In User Profile
// =======================================
export const getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
      isSuspended: req.user.isSuspended,
    });
  } catch (err) {
    console.error("❌ Profile Error:", err.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// =======================================
// ✅ Suspend/Unsuspend a User Account (Admin)
// =======================================
export const suspendUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({
      message: `${user.name} is now ${user.isSuspended ? "suspended" : "active"}`,
      isSuspended: user.isSuspended,
    });
  } catch (err) {
    console.error("❌ Suspend Error:", err.message);
    res.status(500).json({ message: "Server error during suspension toggle" });
  }
};

// =======================================
// ✅ Verify a User Account (Admin)
// =======================================
export const verifyUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: `${user.name} has been verified successfully` });
  } catch (err) {
    console.error("❌ Verify Error:", err.message);
    res.status(500).json({ message: "Server error during verification" });
  }
};

// =======================================
// ✅ Get All Users (Admin Only)
// =======================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Get All Users Error:", err.message);
    res.status(500).json({ message: "Server error fetching users" });
  }
};
