import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";

import purchaseRouter from "./api/purchase";
import issueRouter from "./api/issue";
import projectRouter from "./api/project";

import openingStockRouter from "./api/openingStock";
import cors from "cors";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";


// Create an Express instance
const app = express();

// Middleware to parse the JSON data in the request body
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/purchase-entries",purchaseRouter);
app.use("/api/issues",issueRouter);
app.use("/api/projects",projectRouter);

app.use("/api/opening-stock",openingStockRouter);

app.use(globalErrorHandlingMiddleware);

// Define the port to run the server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));