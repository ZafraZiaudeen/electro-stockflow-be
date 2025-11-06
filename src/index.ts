import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";

import purchaseRouter from "./api/purchase";
import issueRouter from "./api/issue";
import projectRouter from "./api/project";
import openingStockRouter from "./api/openingStock";
import usersRouter from "./api/users";
import webhooksRouter from "./api/webhooks";

import cors from "cors";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";


// Create an Express instance
const app = express();

app.use("/api/webhooks", express.raw({ type: 'application/json' }), webhooksRouter);

app.use(express.json());
app.use(cors({
  origin: ["https://elctrostockflow.netlify.app", "http://localhost:5173"],
  credentials: true
}));

connectDB();

app.use("/api/purchase-entries", purchaseRouter);
app.use("/api/issues", issueRouter);
app.use("/api/projects", projectRouter);
app.use("/api/opening-stock", openingStockRouter);
app.use("/api/users", usersRouter);

app.use(globalErrorHandlingMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));