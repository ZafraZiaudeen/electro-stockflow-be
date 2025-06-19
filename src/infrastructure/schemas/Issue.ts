// infrastructure/schemas/Issue.ts
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: [true, "Part Number is required"],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  projects: [
    {
      projectName: {
        type: String,
        required: [true, "Project Name is required"],
        trim: true,
        //ref: "Project", // Reference to Project schema
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0, "Quantity cannot be negative"],
      },
    },
  ],
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  poNumber: {
    type: String,
    required: [true, "PO Number is required"],
    trim: true,
    //ref: "PurchaseEntry",
  },
});

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;