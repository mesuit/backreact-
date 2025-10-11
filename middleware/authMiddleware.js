import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================
// ✅ Verify Token Middleware
// =====================================
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for "Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user using ID in token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user info + role from token
    req.user = {
      ...user.toObject(),
      role: decoded.role || user.role, // ✅ ensure role is present
    };

    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// =====================================
// ✅ Verify Admin Role Middleware
// =====================================
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check role either from token or DB
    if (req.user.role !== "admin" && req.user.isAdmin !== true) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (err) {
    console.error("❌ Admin check failed:", err.message);
    res.status(403).json({ message: "Admin access required" });
  }
};

// =====================================
// ✅ Protect (for logged-in users only)
// =====================================
export const protect = verifyToken;
