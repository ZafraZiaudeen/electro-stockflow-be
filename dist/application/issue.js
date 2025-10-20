"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableInventoryByPartNumber = exports.getAllIssues = exports.createIssue = void 0;
const Issue_1 = __importDefault(require("../infrastructure/schemas/Issue"));
const Inventory_1 = __importDefault(require("../infrastructure/schemas/Inventory"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const createIssue = async (req, res, next) => {
    try {
        const { partNumber, quantity, projects, poNumber } = req.body;
        if (!partNumber || !quantity || !projects || !poNumber) {
            throw new validation_error_1.default("Part Number, Quantity, Projects, and PO Number are required");
        }
        // Check total available quantity
        const totalAvailable = await Inventory_1.default.aggregate([
            { $match: { partNumber, transactionType: "purchase" } },
            { $group: { _id: null, total: { $sum: "$quantity" } } },
        ]).then((result) => result[0]?.total || 0);
        if (totalAvailable < quantity) {
            throw new validation_error_1.default(`Insufficient total quantity available for ${partNumber}. Available: ${totalAvailable}, Requested: ${quantity}`);
        }
        // Fetch all inventory entries for the part number, sorted by purchase date (FIFO)
        const inventoryEntries = await Inventory_1.default.find({ partNumber, transactionType: "purchase" })
            .sort("purchaseDate");
        let remainingQuantity = quantity;
        for (const entry of inventoryEntries) {
            if (remainingQuantity <= 0)
                break;
            const availableQty = entry.quantity;
            if (availableQty > 0) {
                const qtyToIssue = Math.min(remainingQuantity, availableQty);
                entry.quantity -= qtyToIssue;
                await entry.save();
                // Record the issue in inventory with project details
                await Inventory_1.default.create({
                    partNumber,
                    makeCompany: entry.makeCompany,
                    purchaseDate: entry.purchaseDate,
                    quantity: qtyToIssue,
                    unit: entry.unit,
                    unitPrice: entry.unitPrice,
                    poNumber: entry.poNumber,
                    transactionType: "issue",
                    issueDate: new Date(),
                    projectName: projects[0]?.projectName || null,
                });
                remainingQuantity -= qtyToIssue;
            }
        }
        if (remainingQuantity > 0) {
            throw new validation_error_1.default(`Insufficient total quantity available for ${partNumber}. Remaining: ${remainingQuantity}`);
        }
        const totalProjectUnits = projects.reduce((sum, proj) => sum + proj.quantity, 0);
        if (totalProjectUnits !== quantity) {
            throw new validation_error_1.default("Sum of project quantities must equal total quantity");
        }
        const issue = await Issue_1.default.create({ partNumber, quantity, projects, poNumber });
        res.status(201).json(issue);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createIssue = createIssue;
const getAllIssues = async (req, res, next) => {
    try {
        const issues = await Issue_1.default.find().populate("poNumber", "poNumber items").populate("projects.projectName", "projectName");
        res.status(200).json(issues);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllIssues = getAllIssues;
const getAvailableInventoryByPartNumber = async (req, res, next) => {
    try {
        const partNumber = req.params.partNumber;
        console.log("part", partNumber);
        const inventory = await Inventory_1.default.find({ partNumber, transactionType: "purchase" })
            .sort("purchaseDate");
        // Removed .populate("poNumber", "poNumber purchaseDate")
        if (!inventory.length) {
            throw new not_found_error_1.default(`No inventory found for part number ${partNumber}`);
        }
        res.status(200).json(inventory);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAvailableInventoryByPartNumber = getAvailableInventoryByPartNumber;
//# sourceMappingURL=issue.js.map