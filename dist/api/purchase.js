"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_1 = require("../application/purchase");
const purchaseRouter = express_1.default.Router();
purchaseRouter.get("/", purchase_1.getAllPurchaseEntries);
purchaseRouter.get("/:id", purchase_1.getPurchaseEntryById);
purchaseRouter.get("/part/:partNumber", purchase_1.getPurchaseEntryByPartNumber);
purchaseRouter.post("/", purchase_1.createPurchaseEntry);
purchaseRouter.put("/:id", purchase_1.updatePurchaseEntry);
purchaseRouter.delete("/:id", purchase_1.deletePurchaseEntry);
exports.default = purchaseRouter;
//# sourceMappingURL=purchase.js.map