"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = require("../application/project");
const projectRouter = express_1.default.Router();
projectRouter.post("/", project_1.createProject);
projectRouter.get("/", project_1.getAllProjects);
projectRouter.get("/:projectNumber", project_1.getProjectById); // Updated route parameter
projectRouter.put("/:projectNumber", project_1.updateProject); // Updated route parameter
projectRouter.delete("/:projectNumber", project_1.deleteProject); // Updated route parameter
exports.default = projectRouter;
//# sourceMappingURL=project.js.map