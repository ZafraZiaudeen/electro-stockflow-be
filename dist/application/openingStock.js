"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOpeningStock = exports.createOpeningStock = void 0;
const OpeningStock_1 = __importDefault(require("../infrastructure/schemas/OpeningStock"));
const Inventory_1 = __importDefault(require("../infrastructure/schemas/Inventory"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const createOpeningStock = async (req, res, next) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new validation_error_1.default("Items array is required and must not be empty");
        }
        const createdEntries = [];
        for (const item of items) {
            const entry = await OpeningStock_1.default.create({
                partNumber: item.partNumber,
                makeCompany: item.makeCompany,
                description: item.description,
                unit: item.unit,
                packing: item.packing,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
            });
            createdEntries.push(entry);
            // Update Inventory with opening stock
            await Inventory_1.default.create({
                partNumber: item.partNumber,
                makeCompany: item.makeCompany,
                purchaseDate: entry.entryDate,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                poNumber: `OPENING-${entry._id}`,
                transactionType: "opening",
            });
        }
        res.status(201).json(createdEntries);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createOpeningStock = createOpeningStock;
const getAllOpeningStock = async (req, res, next) => {
    try {
        const entries = await OpeningStock_1.default.find();
        res.status(200).json(entries);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOpeningStock = getAllOpeningStock;
//# sourceMappingURL=openingStock.js.map