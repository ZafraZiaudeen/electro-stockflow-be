import express from "express";
import { createLaundryCategory, getAllLaundryCategories, getLaundryCategoryById, deleteLaundryCategory, updateLaundryCategory } from "../application/category";
import { isAdmin } from "./middlewares/authorization-middleware";
import { isAuthenticated } from "./middlewares/authentication-middleware";
const categoryRouter = express.Router();

categoryRouter.get("/", getAllLaundryCategories);
categoryRouter.get("/:id", getLaundryCategoryById);
categoryRouter.post("/", isAuthenticated,isAdmin,createLaundryCategory);
categoryRouter.put("/:id",isAuthenticated,isAdmin, updateLaundryCategory);
categoryRouter.delete("/:id",isAuthenticated,isAdmin, deleteLaundryCategory);

export default categoryRouter;