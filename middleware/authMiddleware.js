import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================
// ✅ Verify Token Middleware
// =====================================
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // 🔍 Check for token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 🔑 Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧩 Fetch user data from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Attach user info (ensure role is carried forward)
    req.user = {
      ...user.toObject(),
      role: decoded.role || user.role,
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// =====================================
// ✅ Admin-Only Access Middleware
// =====================================
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // 🛡️ Allow access if user is admin
    if (req.user.role === "admin" || req.user.isAdmin === true) {
      return next();
    }

    return res.status(403).json({ message: "Access denied. Admins only." });
  } catch (err) {
    console.error("❌ Admin check failed:", err.message);
    return res.status(403).json({ message: "Admin access required" });
  }
};

// =====================================
// ✅ Simple Protect Alias (for readability)
// =====================================
export const protect = verifyToken;

// =====================================
// ✅ Admin Shortcut Middleware (optional alias)
// =====================================
export const adminOnly = [verifyToken, verifyAdmin];
