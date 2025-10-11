import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================
// ✅ Middleware: Verify Token
// =====================================
export const verifyToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Verify token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user based on ID in token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err.message);
    return res.status(401).json({ message: "Token is not valid or expired" });
  }
};

// =====================================
// ✅ Middleware: Verify Admin Role
// =====================================
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    console.error("❌ Admin verification failed:", err.message);
    return res.status(403).json({ message: "Admin access required" });
  }
};

// =====================================
// ✅ (Optional) Middleware: Verify Logged-in User Only
// =====================================
export const protect = (req, res, next) => {
  verifyToken(req, res, next);
};
