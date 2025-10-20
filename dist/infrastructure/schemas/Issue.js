"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// infrastructure/schemas/Issue.ts
const mongoose_1 = __importDefault(require("mongoose"));
const issueSchema = new mongoose_1.default.Schema({
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
const Issue = mongoose_1.default.model("Issue", issueSchema);
exports.default = Issue;
//# sourceMappingURL=Issue.js.map