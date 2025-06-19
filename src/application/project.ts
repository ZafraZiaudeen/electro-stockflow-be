// infrastructure/controllers/purchase.ts
import { NextFunction, Request, Response } from "express";
import Project from "../infrastructure/schemas/Project";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectName, projectNumber, description, status } = req.body;
    if (!projectName || !projectNumber || !description || !status) {
      throw new ValidationError("All project fields are required");
    }

    const project = await Project.create({ projectName, projectNumber, description, status });
    res.status(201).json(project);
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
    return;
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectNumber = req.params.projectNumber; // Changed from projectId to projectNumber
    const project = await Project.findOne({ projectNumber }); // Changed from findById to findOne
    if (!project) {
      throw new NotFoundError("Project not found");
    }
    res.status(200).json(project);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectNumber = req.params.projectNumber; // Changed from projectId to projectNumber
    const { projectName, description, status } = req.body;
    if (!projectName || !projectNumber || !description || !status) {
      throw new ValidationError("All project fields are required");
    }

    const updatedProject = await Project.findOneAndUpdate(
      { projectNumber }, // Use projectNumber for lookup
      { projectName, projectNumber, description, status }, // Update all fields
      { new: true, runValidators: true } // Return updated document and run validators
    );
    if (!updatedProject) {
      throw new NotFoundError("Project not found");
    }
    res.status(200).json(updatedProject);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectNumber = req.params.projectNumber; // Changed from projectId to projectNumber
    const deletedProject = await Project.findOneAndDelete({ projectNumber }); // Changed from findByIdAndDelete to findOneAndDelete
    if (!deletedProject) {
      throw new NotFoundError("Project not found");
    }
    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};