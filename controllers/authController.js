import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ================================
// Register new user
// ================================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Default role is student
    let role = "student";

    // ✅ Auto-assign admin if email matches .env ADMIN_EMAIL
    if (email === process.env.ADMIN_EMAIL) {
      role = "admin";
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified || false,
      isSuspended: user.isSuspended || false,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// Login user
// ================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ include role
        isVerified: user.isVerified || false,
        isSuspended: user.isSuspended || false,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// Get user profile
// ================================
export const getProfile = async (req, res) => {
  res.json(req.user);
};
