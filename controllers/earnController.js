// controllers/earnController.js
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";

// ===============================
// ⚙️ CREATE assignment (Admin)
// ===============================
export const createAssignment = async (req, res) => {
  try {
    const { title, description, type, link } = req.body;
    let fileUrl = "";

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const newAssignment = await Assignment.create({
      title,
      description,
      type,
      link,
      file: fileUrl,
      submittedBy: req.user.id,
    });

    res.status(201).json(newAssignment);
  } catch (error) {
    console.error("❌ Create Assignment Error:", error);
    res.status(500).json({ error: "Error creating assignment" });
  }
};

// ===============================
// 📘 GET all assignments (Admin)
// ===============================
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error("❌ Get All Assignments Error:", error);
    res.status(500).json({ error: "Error fetching all assignments" });
  }
};

// ===============================
// 📘 GET available assignments (Users)
// ===============================
export const getAssignments = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { status: "pending" };
    if (type) query.type = type;

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    console.error("❌ Get Assignments Error:", error);
    res.status(500).json({ error: "Error fetching assignments" });
  }
};

// ===============================
// 💼 ACCEPT assignment (User)
// ===============================
export const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ error: "Assignment not found" });

    assignment.status = "in-progress";
    assignment.assignedTo = req.user.id;
    await assignment.save();

    res.json({
      message: `Assignment "${assignment.title}" accepted. Check your email for instructions.`,
      assignment,
    });
  } catch (error) {
    console.error("❌ Accept Assignment Error:", error);
    res.status(500).json({ error: "Error accepting assignment" });
  }
};

// ===============================
// 🔒 GET user earnings data
// ===============================
export const getUserEarnData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      name: user.name,
      totalEarnings: user.earnings || 0,
      tasksCompleted: user.acceptedAssignments?.length || 0,
      referrals: user.referrals || { count: 0, points: 0 },
    });
  } catch (error) {
    console.error("❌ Get User Data Error:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};
