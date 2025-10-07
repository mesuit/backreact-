import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // student submission
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // if admin posts to user
  type: { type: String, enum: ["local", "international"], default: "local" },
  file: { type: String }, // file URL or path
  link: { type: String }, // optional external link
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);

