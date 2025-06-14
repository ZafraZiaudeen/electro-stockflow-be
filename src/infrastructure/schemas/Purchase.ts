import mongoose from "mongoose";

const purchaseEntrySchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  grn: {
    type: String,
    required: true,
    unique: true,
  },
  totalValue: {
    type: Number,
    required: true,
    default: 0.00,
  },
  items: [{
    partNumber: {
      type: String,
      required: true,
    },
    makeCompany: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      enum: ['Pieces', 'Units', 'Kgs', 'Liters'],
      required: true,
    },
    packing: {
      type: Number,
      required: true,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      default: 0.00,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  }],
});

const PurchaseEntry = mongoose.model("PurchaseEntry", purchaseEntrySchema);

export default PurchaseEntry;