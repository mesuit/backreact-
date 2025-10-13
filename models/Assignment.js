import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    deadline: { type: Date },
    filePath: { type: String },    // server path (e.g. /uploads/filename.pdf)
    fileUrl: { type: String },     // public URL (constructed on save or by frontend)
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["local", "international"], default: "local" },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
