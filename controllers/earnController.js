import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import path from "path";

// GET /api/earn/me
export const getUserEarnData = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findById(userId).select("balance referrals email name");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({
      balance: user.balance || 0,
      referrals: user.referrals || { count: 0, points: 0 },
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("getUserEarnData error:", err);
    return res.status(500).json({ error: "Server error fetching user data" });
  }
};

// GET /api/earn/assignments  (user view; optional type query)
export const getAssignments = async (req, res) => {
  try {
    const type = req.query.type; // optional: local/international
    const filter = { status: "open" };
    if (type) filter.type = type;
    const assignments = await Assignment.find(filter).sort({ createdAt: -1 });
    // build fileUrl if filePath exists
    const host = `${req.protocol}://${req.get("host")}`;
    const data = assignments.map((a) => {
      const obj = a.toObject();
      if (obj.filePath) obj.fileUrl = `${host}/uploads/${path.basename(obj.filePath)}`;
      return obj;
    });
    return res.json(data);
  } catch (err) {
    console.error("getAssignments error:", err);
    return res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// GET /api/earn/assignments/all  (admin view)
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 }).populate("createdBy", "name email");
    const host = `${req.protocol}://${req.get("host")}`;
    const data = assignments.map((a) => {
      const obj = a.toObject();
      if (obj.filePath) obj.fileUrl = `${host}/uploads/${path.basename(obj.filePath)}`;
      return obj;
    });
    return res.json(data);
  } catch (err) {
    console.error("getAllAssignments error:", err);
    return res.status(500).json({ error: "Failed to fetch all assignments" });
  }
};

// POST /api/earn/assignments/create (admin)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, price, deadline, type } = req.body;
    if (!title || !description) return res.status(400).json({ error: "Title and description required" });

    const assignmentData = {
      title,
      description,
      price: price ? Number(price) : 0,
      deadline: deadline ? new Date(deadline) : undefined,
      type: type || "local",
      createdBy: req.user ? req.user._id : undefined,
    };

    if (req.file) {
      // multer stored file at req.file.path
      assignmentData.filePath = req.file.path;
      // fileUrl will be constructed when sending to client
    }

    const assignment = await Assignment.create(assignmentData);
    return res.status(201).json({ message: "Assignment created", assignment });
  } catch (err) {
    console.error("createAssignment error:", err);
    return res.status(500).json({ error: "Failed to create assignment" });
  }
};

// POST /api/earn/assignments/:id/accept (user accepts assignment)
export const acceptAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || assignment.status !== "open") return res.status(404).json({ error: "Assignment not available" });

    // Implement your acceptance logic: create submission, notify admin, etc.
    // For now, just respond success — extend as needed.
    return res.json({ message: "Assignment accepted. Submit via the submission endpoint." });
  } catch (err) {
    console.error("acceptAssignment error:", err);
    return res.status(500).json({ error: "Failed to accept assignment" });
  }
};
