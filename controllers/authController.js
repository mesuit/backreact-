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

    // 1️⃣ Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // 2️⃣ Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // 3️⃣ Default role = student
    let role = "student";
    let isAdmin = false;

    // 4️⃣ Auto-assign admin if email matches ADMIN_EMAIL in .env
    if (email === process.env.ADMIN_EMAIL) {
      role = "admin";
      isAdmin = true;
    }

    // 5️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      isAdmin,
      isVerified: true,
      isSuspended: false,
    });

    // 6️⃣ Respond with token + profile
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

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found. Please register." });

    // 2️⃣ Check if suspended
    if (user.isSuspended)
      return res.status(403).json({ message: "Account suspended. Contact admin." });

    // 3️⃣ Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // 4️⃣ Return success response
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
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Return clean user info
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
// ✅ Suspend a User Account (Admin Action)
// =======================================
export const suspendUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isSuspended = true;
    await user.save();

    res.json({ message: `${user.name} has been suspended successfully` });
  } catch (err) {
    console.error("❌ Suspend Error:", err.message);
    res.status(500).json({ message: "Server error during suspension" });
  }
};

// =======================================
// ✅ Verify a User Account (Admin Action)
// =======================================
export const verifyUserAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    await user.save();

    res.json({ message: `${user.name} has been verified successfully` });
  } catch (err) {
    console.error("❌ Verify Error:", err.message);
    res.status(500).json({ message: "Server error during verification" });
  }
};
