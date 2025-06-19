import { NextFunction, Request, Response } from "express";

import Project from "../infrastructure/schemas/Projects";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateProjectDTO } from "../domain/dto/projects";

export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const project = CreateProjectDTO.safeParse(req.body);
   

    if (!project.success) {
      throw new ValidationError(project.error.message);
    }

     await Project.create({
      name: project.data.name,
      projectNumber: project.data.projectNumber,
      description: project.data.description,
    });

    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
    return;
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if (!project) {
      throw new NotFoundError("Project not found");
    }

    res.status(200).json(project);
    return;
  } catch (error) {
    next(error);
  }
};



export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    await Project.findByIdAndDelete(projectId);

    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    const updatedProject = req.body;

    if (
      !updatedProject.name ||
      !updatedProject.projectNumber ||
      !updatedProject.description
    ) {
      throw new ValidationError("Invalid project data");
    }

    await Project.findByIdAndUpdate(projectId, updatedProject);

    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};