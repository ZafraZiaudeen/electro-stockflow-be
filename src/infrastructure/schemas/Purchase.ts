import mongoose from "mongoose";

const purchaseEntrySchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: [true, "PO Number is required"],
    trim: true,
  },
  purchaseDate: {
    type: Date,
    required: [true, "Purchase Date is required"],
    default: Date.now,
    validate: {
      validator: (value: Date) => !isNaN(value.getTime()),
      message: "Invalid date format for purchaseDate",
    },
  },
  grn: {
    type: String,
    required: [true, "GRN is required"],
    unique: true,
    trim: true,
  },
  totalValue: {
    type: Number,
    required: [true, "Total Value is required"],
    default: 0.00,
    min: [0, "Total Value cannot be negative"],
  },
  items: [
    {
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
        required: [true, "Description is required"],
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
        type: Number,
        required: [true, "Packing is required"],
        default: 1,
        min: [1, "Packing must be at least 1"],
      },
      unitPrice: {
        type: Number,
        required: [true, "Unit Price is required"],
        default: 0.00,
        min: [0, "Unit Price cannot be negative"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        default: 0,
        min: [0, "Quantity cannot be negative"],
      },
    },
  ],
});

const PurchaseEntry = mongoose.model("PurchaseEntry", purchaseEntrySchema);

export default PurchaseEntry;