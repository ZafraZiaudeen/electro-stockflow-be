import express from "express";
import { createIssue,getAllIssues,getAvailableInventoryByPartNumber } from "../application/issue";
const issueRouter = express.Router();

issueRouter.post("/", createIssue);
issueRouter.get("/", getAllIssues);
issueRouter.get("/available/:partNumber",getAvailableInventoryByPartNumber);



export default issueRouter;