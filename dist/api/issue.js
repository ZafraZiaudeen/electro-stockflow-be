"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const issue_1 = require("../application/issue");
const issueRouter = express_1.default.Router();
issueRouter.post("/", issue_1.createIssue);
issueRouter.get("/", issue_1.getAllIssues);
issueRouter.get("/available/:partNumber", issue_1.getAvailableInventoryByPartNumber);
exports.default = issueRouter;
//# sourceMappingURL=issue.js.map