import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 10,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["local", "international"],
      default: "local",
    },
    file: {
      type: String,
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
    pay: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional index to optimize frequent lookups by department or type
assignmentSchema.index({ department: 1, type: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
