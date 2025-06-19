// infrastructure/schemas/project.ts
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, "Project Name is required"],
    trim: true,
    unique: true,
  },
  projectNumber: {
    type: String,
    required: [true, "Project Number is required"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ["active", "inactive"],
      message: "{VALUE} is not a valid status",
    },
    required: [true, "Status is required"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;