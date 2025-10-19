// application/purchase.ts
import { NextFunction, Request, Response } from "express";
import PurchaseEntry from "../infrastructure/schemas/Purchase";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreatePurchaseEntryDTO } from "../domain/dto/purchase";
import Inventory from "../infrastructure/schemas/Inventory";
import { v4 as uuidv4 } from "uuid"; 
export const getAllPurchaseEntries = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await PurchaseEntry.find();
    res.status(200).json(entries);
    return;
  } catch (error) {
    next(error);
  }
};

export const getPurchaseEntryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entryId = req.params.id;
    const entry = await PurchaseEntry.findById(entryId);
    if (!entry) {
      throw new NotFoundError("Purchase entry not found");
    }
    res.status(200).json(entry);
    return;
  } catch (error) {
    next(error);
  }
};

export const createPurchaseEntry = async (req: any, res: any, next: any) => {
  try {
    const entry = CreatePurchaseEntryDTO.safeParse(req.body);
    if (!entry.success) {
      throw new ValidationError(entry.error.message);
    }

    // Check for duplicate GRN
    const existingEntry = await PurchaseEntry.findOne({ grn: entry.data.grn });
    if (existingEntry) {
      throw new ValidationError(`GRN ${entry.data.grn} already exists. Please use a unique GRN or leave it blank to auto-generate.`);
    }

    const newEntry = await PurchaseEntry.create({
      poNumber: entry.data.poNumber,
      purchaseDate: entry.data.purchaseDate || new Date(),
      grn: entry.data.grn || `GRN-${new Date().toISOString().split("T")[0]}-${uuidv4().slice(0, 8)}`,
      totalValue: entry.data.totalValue,
      items: entry.data.items,
    });

    // Update Inventory for each item
    for (const item of entry.data.items) {
      await Inventory.create({
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
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entryId = req.params.id;
    await PurchaseEntry.findByIdAndDelete(entryId);
    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entryId = req.params.id;
    const updatedEntry = req.body;

    if (
      !updatedEntry.poNumber ||
      !updatedEntry.grn ||
      !updatedEntry.items ||
      updatedEntry.items.some(
        (item: any) =>
          !item.partNumber ||
          !item.makeCompany ||
          !item.description ||
          !item.unit ||
          item.packing === undefined ||
          item.unitPrice === undefined ||
          item.quantity === undefined
      )
    ) {
      throw new ValidationError("Invalid purchase entry data");
    }

    const existingEntry = await PurchaseEntry.findById(entryId);
    if (!existingEntry) {
      throw new NotFoundError("Purchase entry not found");
    }

    // Check for duplicate GRN if changed
    if (updatedEntry.grn !== existingEntry.grn) {
      const grnExists = await PurchaseEntry.findOne({ grn: updatedEntry.grn });
      if (grnExists) {
        throw new ValidationError(`GRN ${updatedEntry.grn} already exists.`);
      }
    }

    await PurchaseEntry.findByIdAndUpdate(entryId, updatedEntry, { new: true, runValidators: true });
    res.status(200).json(await PurchaseEntry.findById(entryId)); // Return updated entry
    return;
  } catch (error) {
    next(error);
  }
};

export const getPurchaseEntryByPartNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const partNumber = req.params.partNumber;
    const entry = await PurchaseEntry.findOne({ "items.partNumber": partNumber });
    if (!entry) {
      throw new NotFoundError("No purchase entry found for the given part number");
    }
    res.status(200).json(entry);
    return;
  } catch (error) {
    next(error);
  }
};