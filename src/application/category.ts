import { NextFunction, Request, Response } from "express";
import LaundryCategory from "../infrastructure/schemas/Category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { CreateLaundryCategoryDTO } from "../domain/dto/category";

export const getAllLaundryCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await LaundryCategory.find();
    res.status(200).json(categories);
    return;
  } catch (error) {
    next(error);
  }
};

export const getLaundryCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.id;
    const category = await LaundryCategory.findById(categoryId);
    if (!category) {
      throw new NotFoundError("Laundry category not found");
    }

    res.status(200).json(category);
    return;
  } catch (error) {
    next(error);
  }
};

export const createLaundryCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = CreateLaundryCategoryDTO.safeParse(req.body);
    // Validate the request data
    if (!category.success) {
      throw new ValidationError(category.error.message);
    }

    // Add the laundry category
    await LaundryCategory.create({
      name: category.data.name,
      description: category.data.description,
      processingTime: category.data.processingTime,
      available: category.data.available ?? true, 
    });

    // Return the response
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

// Delete a laundry category
export const deleteLaundryCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.id;
    await LaundryCategory.findByIdAndDelete(categoryId);

    // Return the response
    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};

// Update a laundry category
export const updateLaundryCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.id; 
    const updatedCategory = req.body;

    // Validate the request data
    if (
      !updatedCategory.name ||
      !updatedCategory.description ||
      !updatedCategory.processingTime
    ) {
      throw new ValidationError("Invalid laundry category data");
    }

    await LaundryCategory.findByIdAndUpdate(categoryId, updatedCategory);

    // Return the response
    res.status(200).send();
    return;
  } catch (error) {
    next(error);
  }
};