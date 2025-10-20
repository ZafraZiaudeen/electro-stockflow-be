"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// infrastructure/schemas/project.ts
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
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
const Project = mongoose_1.default.model("Project", projectSchema);
exports.default = Project;
//# sourceMappingURL=Project.js.map