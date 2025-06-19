// infrastructure/schemas/OpeningStock.ts
import mongoose from "mongoose";

const openingStockSchema = new mongoose.Schema({
  partNumber: {
    type: String,
    required: [true, "Part Number is required"],
    trim: true,
  },
  makeCompany: {
    type: String,
    required: [true, "Make Company is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  unit: {
    type: String,
    enum: {
      values: ["Box", "Packets", "EA", "Roll", "Pieces", "Nos", "Meters", "Lot"],
      message: "{VALUE} is not a valid unit",
    },
    required: [true, "Unit is required"],
  },
  packing: {
    type: String,
    required: [true, "Packing is required"],
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit Price is required"],
    min: [0, "Unit Price cannot be negative"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
});

const OpeningStock = mongoose.model("OpeningStock", openingStockSchema);
export default OpeningStock;