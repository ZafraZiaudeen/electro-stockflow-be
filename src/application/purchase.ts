import { NextFunction, Request, Response } from "express";
import PurchaseEntry from "../infrastructure/schemas/Purchase";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreatePurchaseEntryDTO } from "../domain/dto/purchase";

export const getAllPurchaseEntries = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const entries = await PurchaseEntry.find();
    res.status(200).json(entries);
    return;
  } catch (error) {
    next(error);
  }
};

export const getPurchaseEntryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const createPurchaseEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const entry = CreatePurchaseEntryDTO.safeParse(req.body);
    if (!entry.success) {
      throw new ValidationError(entry.error.message);
    }

    await PurchaseEntry.create({
      poNumber: entry.data.poNumber,
      purchaseDate: entry.data.purchaseDate || new Date(),
      grn: entry.data.grn,
      totalValue: entry.data.totalValue,
      items: entry.data.items,
    });

    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const deletePurchaseEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const entryId = req.params.id;
    await PurchaseEntry.findByIdAndDelete(entryId);

    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePurchaseEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    await PurchaseEntry.findByIdAndUpdate(entryId, updatedEntry);

    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};
export const getPurchaseEntryByPartNumber = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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