import express from "express";
import { createLaundryCategory, getAllLaundryCategories, getLaundryCategoryById, deleteLaundryCategory, updateLaundryCategory } from "../application/category";

const categoryRouter = express.Router();

categoryRouter.get("/", getAllLaundryCategories);
categoryRouter.get("/:id", getLaundryCategoryById);
categoryRouter.post("/", createLaundryCategory);
categoryRouter.put("/:id", updateLaundryCategory);
categoryRouter.delete("/:id", deleteLaundryCategory);

export default categoryRouter;