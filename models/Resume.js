import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  analysis: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Resume", resumeSchema);