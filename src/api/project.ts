import express from "express";
import {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    updateProject
} from "../application/projects";
import { isAuthenticated } from './middlewares/authentication-middleware';
import { isAdmin } from './middlewares/authorization-middleware';
const projectsRouter = express.Router();

projectsRouter.route("/").get(getAllProjects).post(createProject);
projectsRouter
  .route("/:id")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default projectsRouter;