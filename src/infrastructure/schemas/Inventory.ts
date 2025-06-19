// infrastructure/schemas/Inventory.ts
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
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
  purchaseDate: {
    type: Date,
    required: [true, "Purchase Date is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
  unit: {
    type: String,
    enum: {
      values: ["Box", "Packets", "EA", "Roll", "Pieces", "Nos", "Meters", "Lot"],
      message: "{VALUE} is not a valid unit",
    },
    required: [true, "Unit is required"],
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit Price is required"],
    min: [0, "Unit Price cannot be negative"],
  },
  poNumber: {
    type: String,
    required: [true, "PO Number is required"],
    trim: true,
  }, // Removed ref: "PurchaseEntry"
  transactionType: {
    type: String,
    enum: {
      values: ["purchase", "issue", "opening"],
      message: "{VALUE} is not a valid transaction type",
    },
    required: [true, "Transaction type is required"],
  },
  issueDate: {
    type: Date,
  },
  projectName: {
    type: String,
    trim: true,
    
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;