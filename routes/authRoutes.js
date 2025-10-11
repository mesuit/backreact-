import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================================
// ✅ Generate JWT token with role + ID
// =======================================
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// =======================================
// ✅ Register new user
// =======================================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

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
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended || false,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================================
// ✅ Login user
// =======================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended || false,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =======================================
// ✅ Get logged-in user profile
// =======================================
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =======================================
// ✅ Suspend a user (Admin only)
// =======================================
export const suspendUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = true;
    await user.save();

    res.json({ message: `${user.name} has been suspended successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =======================================
// ✅ Verify a user (Admin only)
// =======================================
export const verifyUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: `${user.name} has been verified successfully.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export default router;

