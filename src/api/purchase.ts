import express from "express";
import { createPurchaseEntry,getAllPurchaseEntries,getPurchaseEntryById,deletePurchaseEntry,updatePurchaseEntry,getPurchaseEntryByPartNumber } from "../application/purchase";
const purchaseRouter = express.Router();

purchaseRouter.get("/", getAllPurchaseEntries);
purchaseRouter.get("/:id", getPurchaseEntryById);
purchaseRouter.get("/part/:partNumber",getPurchaseEntryByPartNumber);
purchaseRouter.post("/", createPurchaseEntry);
purchaseRouter.put("/:id", updatePurchaseEntry);
purchaseRouter.delete("/:id", deletePurchaseEntry);

export default purchaseRouter;