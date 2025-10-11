import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =====================================
// ✅ Generate JWT Token with Role + Admin Flag
// =====================================
const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

// =====================================
// ✅ Register New User
// =====================================
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Default role is 'student'
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

    // Respond with token + user data
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified || false,
      isSuspended: user.isSuspended || false,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Error registering user:", err.message);
    res.status(500).json({ message: "Server error while registering user." });
  }
};

// =====================================
// ✅ Login Existing User
// =====================================
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with user info + token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified || false,
      isSuspended: user.isSuspended || false,
      token: generateToken(user),
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error while logging in." });
  }
};

// =====================================
// ✅ Get Current User Profile
// =====================================
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
