import mongoose from "mongoose";

const laundryCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  processingTime: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  }
});

const LaundryCategory = mongoose.model("LaundryCategory", laundryCategorySchema);

export default LaundryCategory;