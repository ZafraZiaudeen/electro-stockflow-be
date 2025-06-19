// api/openingStockRouter.ts
import express from "express";
import { createOpeningStock, getAllOpeningStock } from "../application/openingStock";

const openingStockRouter = express.Router();

openingStockRouter .post("/", createOpeningStock);
openingStockRouter .get("/", getAllOpeningStock);

export default openingStockRouter ;