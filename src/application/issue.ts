// application/issue.ts
import { NextFunction, Request, Response } from "express";
import Issue from "../infrastructure/schemas/Issue";
import PurchaseEntry from "../infrastructure/schemas/Purchase";
import Inventory from "../infrastructure/schemas/Inventory";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { partNumber, quantity, projects, poNumber } = req.body;
    if (!partNumber || !quantity || !projects || !poNumber) {
      throw new ValidationError("Part Number, Quantity, Projects, and PO Number are required");
    }

    // Check total available quantity
    const totalAvailable = await Inventory.aggregate([
      { $match: { partNumber, transactionType: "purchase" } },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]).then((result) => result[0]?.total || 0);

    if (totalAvailable < quantity) {
      throw new ValidationError(`Insufficient total quantity available for ${partNumber}. Available: ${totalAvailable}, Requested: ${quantity}`);
    }

    // Fetch all inventory entries for the part number, sorted by purchase date (FIFO)
    const inventoryEntries = await Inventory.find({ partNumber, transactionType: "purchase" })
      .sort("purchaseDate");

    let remainingQuantity = quantity;
    for (const entry of inventoryEntries) {
      if (remainingQuantity <= 0) break;

      const availableQty = entry.quantity;
      if (availableQty > 0) {
        const qtyToIssue = Math.min(remainingQuantity, availableQty);
        entry.quantity -= qtyToIssue;
        await entry.save();

        // Record the issue in inventory with project details
        await Inventory.create({
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
      throw new ValidationError(`Insufficient total quantity available for ${partNumber}. Remaining: ${remainingQuantity}`);
    }

    const totalProjectUnits = projects.reduce((sum: any, proj: { quantity: any; }) => sum + proj.quantity, 0);
    if (totalProjectUnits !== quantity) {
      throw new ValidationError("Sum of project quantities must equal total quantity");
    }

    const issue = await Issue.create({ partNumber, quantity, projects, poNumber });
    res.status(201).json(issue);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issues = await Issue.find().populate("poNumber", "poNumber items").populate("projects.projectName", "projectName");
    res.status(200).json(issues);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAvailableInventoryByPartNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partNumber = req.params.partNumber;
    console.log("part", partNumber);
    const inventory = await Inventory.find({ partNumber, transactionType: "purchase" })
      .sort("purchaseDate");
    // Removed .populate("poNumber", "poNumber purchaseDate")
    if (!inventory.length) {
      throw new NotFoundError(`No inventory found for part number ${partNumber}`);
    }
    res.status(200).json(inventory);
    return;
  } catch (error) {
    next(error);
  }
};