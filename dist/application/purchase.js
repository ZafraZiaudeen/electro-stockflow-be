"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseEntryByPartNumber = exports.updatePurchaseEntry = exports.deletePurchaseEntry = exports.createPurchaseEntry = exports.getPurchaseEntryById = exports.getAllPurchaseEntries = void 0;
const Purchase_1 = __importDefault(require("../infrastructure/schemas/Purchase"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const purchase_1 = require("../domain/dto/purchase");
const Inventory_1 = __importDefault(require("../infrastructure/schemas/Inventory"));
const uuid_1 = require("uuid");
const getAllPurchaseEntries = async (req, res, next) => {
    try {
        const entries = await Purchase_1.default.find();
        res.status(200).json(entries);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPurchaseEntries = getAllPurchaseEntries;
const getPurchaseEntryById = async (req, res, next) => {
    try {
        const entryId = req.params.id;
        const entry = await Purchase_1.default.findById(entryId);
        if (!entry) {
            throw new not_found_error_1.default("Purchase entry not found");
        }
        res.status(200).json(entry);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getPurchaseEntryById = getPurchaseEntryById;
const createPurchaseEntry = async (req, res, next) => {
    try {
        const entry = purchase_1.CreatePurchaseEntryDTO.safeParse(req.body);
        if (!entry.success) {
            throw new validation_error_1.default(entry.error.message);
        }
        // Check for duplicate GRN
        const existingEntry = await Purchase_1.default.findOne({ grn: entry.data.grn });
        if (existingEntry) {
            throw new validation_error_1.default(`GRN ${entry.data.grn} already exists. Please use a unique GRN or leave it blank to auto-generate.`);
        }
        const newEntry = await Purchase_1.default.create({
            poNumber: entry.data.poNumber,
            purchaseDate: entry.data.purchaseDate || new Date(),
            grn: entry.data.grn || `GRN-${new Date().toISOString().split("T")[0]}-${(0, uuid_1.v4)().slice(0, 8)}`,
            totalValue: entry.data.totalValue,
            items: entry.data.items,
        });
        // Update Inventory for each item
        for (const item of entry.data.items) {
            await Inventory_1.default.create({
                partNumber: item.partNumber,
                makeCompany: item.makeCompany,
                purchaseDate: entry.data.purchaseDate || new Date(),
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                poNumber: entry.data.poNumber,
                transactionType: "purchase",
            });
        }
        res.status(201).json(newEntry); // Return the created entry
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createPurchaseEntry = createPurchaseEntry;
const deletePurchaseEntry = async (req, res, next) => {
    try {
        const entryId = req.params.id;
        await Purchase_1.default.findByIdAndDelete(entryId);
        res.status(200).send();
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.deletePurchaseEntry = deletePurchaseEntry;
const updatePurchaseEntry = async (req, res, next) => {
    try {
        const entryId = req.params.id;
        const updatedEntry = req.body;
        if (!updatedEntry.poNumber ||
            !updatedEntry.grn ||
            !updatedEntry.items ||
            updatedEntry.items.some((item) => !item.partNumber ||
                !item.makeCompany ||
                !item.description ||
                !item.unit ||
                item.packing === undefined ||
                item.unitPrice === undefined ||
                item.quantity === undefined)) {
            throw new validation_error_1.default("Invalid purchase entry data");
        }
        const existingEntry = await Purchase_1.default.findById(entryId);
        if (!existingEntry) {
            throw new not_found_error_1.default("Purchase entry not found");
        }
        // Check for duplicate GRN if changed
        if (updatedEntry.grn !== existingEntry.grn) {
            const grnExists = await Purchase_1.default.findOne({ grn: updatedEntry.grn });
            if (grnExists) {
                throw new validation_error_1.default(`GRN ${updatedEntry.grn} already exists.`);
            }
        }
        await Purchase_1.default.findByIdAndUpdate(entryId, updatedEntry, { new: true, runValidators: true });
        res.status(200).json(await Purchase_1.default.findById(entryId)); // Return updated entry
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.updatePurchaseEntry = updatePurchaseEntry;
const getPurchaseEntryByPartNumber = async (req, res, next) => {
    try {
        const partNumber = req.params.partNumber;
        const entry = await Purchase_1.default.findOne({ "items.partNumber": partNumber });
        if (!entry) {
            throw new not_found_error_1.default("No purchase entry found for the given part number");
        }
        res.status(200).json(entry);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getPurchaseEntryByPartNumber = getPurchaseEntryByPartNumber;
//# sourceMappingURL=purchase.js.map