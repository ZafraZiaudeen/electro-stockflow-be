import express from "express";
import {createProject,getAllProjects,getProjectById,updateProject,deleteProject} from "../application/project";
const projectRouter = express.Router();


projectRouter.post("/", createProject);
projectRouter.get("/", getAllProjects);
projectRouter.get("/:projectNumber", getProjectById); // Updated route parameter
projectRouter.put("/:projectNumber", updateProject); // Updated route parameter
projectRouter.delete("/:projectNumber", deleteProject); // Updated route parameter

export default projectRouter;