"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/openingStockRouter.ts
const express_1 = __importDefault(require("express"));
const openingStock_1 = require("../application/openingStock");
const openingStockRouter = express_1.default.Router();
openingStockRouter.post("/", openingStock_1.createOpeningStock);
openingStockRouter.get("/", openingStock_1.getAllOpeningStock);
exports.default = openingStockRouter;
//# sourceMappingURL=openingStock.js.map