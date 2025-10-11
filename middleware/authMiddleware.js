import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Verify JWT Token
export const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized, token missing" });
    }
  } catch (err) {
    console.error("❌ Protect Error:", err.message);
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// ✅ Admin Role Check
export const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin" && !req.user.isAdmin)
    return res.status(403).json({ message: "Admin access required" });

  next();
};
