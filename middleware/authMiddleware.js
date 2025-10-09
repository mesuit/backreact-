import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect middleware (for logged-in users)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if suspended
      if (user.isSuspended) {
        return res.status(403).json({ message: "Account suspended" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// ✅ Admin-only middleware
export const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Admin access only" });
    }
  } catch (error) {
    console.error("Admin check failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
