import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },

  // New fields
  isVerified: { type: Boolean, default: false },   // payment verified
  isSuspended: { type: Boolean, default: false },  // admin can suspend user
  balance: { type: Number, default: 0 },           // earnings from referrals/assignments
  referralCode: { type: String, unique: true, sparse: true } // optional referral
}, { timestamps: true });

export default mongoose.model("User", userSchema);
