import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import path from "path";
import fs from "fs";

// ⚙️ CREATE new assignment (admin)
export const createAssignment = async (req, res) => {
  try {
    const { title, description, type, link } = req.body;
    let fileUrl = "";

    if (req.file) {
      const filePath = `/uploads/${req.file.filename}`;
      fileUrl = filePath;
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
    res.status(500).json({ error: "Error creating assignment" });
  }
};

// 📘 GET all assignments (admin)
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all assignments" });
  }
};

// 📘 GET available assignments (for users)
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

// 💼 ACCEPT assignment
export const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.status = "in-progress";
    assignment.assignedTo = req.user.id;
    await assignment.save();

    res.json({ message: "Assignment accepted", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error accepting assignment" });
  }
};

// 🔒 GET user earning data
export const getUserEarnData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("acceptedAssignments");
    res.json({
      name: user.name,
      totalEarnings: user.earnings || 0,
      tasksCompleted: user.acceptedAssignments?.length || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
};
