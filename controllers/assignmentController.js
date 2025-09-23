import Assignment from "../models/Assignment.js";
import nodemailer from "nodemailer";

export const submitAssignment = async (req, res) => {
  const { title, department, description } = req.body;

  try {
    const assignment = await Assignment.create({
      title,
      department,
      description,
      submittedBy: req.user._id
    });

    // Notify admin via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.ADMIN_EMAIL, pass: process.env.ADMIN_PASS }
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: "New Assignment Submitted",
      text: `Title: ${title}\nDepartment: ${department}\nDescription: ${description}`
    });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("submittedBy", "name email");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
