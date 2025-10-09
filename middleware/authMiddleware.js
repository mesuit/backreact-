import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔒 Protect middleware — verifies token and attaches user
export const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user (omit password)
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check suspension
      if (user.isSuspended) {
        return res.status(403).json({ message: "Your account is suspended. Contact admin." });
      }

      // Attach to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided"
