// application/openingStock.ts
import { NextFunction, Request, Response } from "express";
import OpeningStock from "../infrastructure/schemas/OpeningStock";
import Inventory from "../infrastructure/schemas/Inventory";
import ValidationError from "../domain/errors/validation-error";

export const createOpeningStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new ValidationError("Items array is required and must not be empty");
    }

    const createdEntries = [];
    for (const item of items) {
      const entry = await OpeningStock.create({
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
      await Inventory.create({
        partNumber: item.partNumber,
        makeCompany: item.makeCompany,
        purchaseDate: entry.entryDate,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        poNumber: `OPENING-${entry._id}`, // Unique PO number for opening stock
        transactionType: "opening",
      });
    }

    res.status(201).json(createdEntries);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllOpeningStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await OpeningStock.find();
    res.status(200).json(entries);
    return;
  } catch (error) {
    next(error);
  }
};