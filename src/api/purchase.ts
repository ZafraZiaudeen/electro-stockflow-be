import express from "express";
import { createPurchaseEntry,getAllPurchaseEntries,getPurchaseEntryById,deletePurchaseEntry,updatePurchaseEntry } from "../application/purchase";
const purchaseRouter = express.Router();

purchaseRouter.get("/", getAllPurchaseEntries);
purchaseRouter.get("/:id", getPurchaseEntryById);
purchaseRouter.post("/", createPurchaseEntry);
purchaseRouter.put("/:id", updatePurchaseEntry);
purchaseRouter.delete("/:id", deletePurchaseEntry);

export default purchaseRouter;