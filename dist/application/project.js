"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../infrastructure/schemas/Project"));
const not_found_error_1 = __importDefault(require("../domain/errors/not-found-error"));
const validation_error_1 = __importDefault(require("../domain/errors/validation-error"));
const createProject = async (req, res, next) => {
    try {
        const { projectName, projectNumber, description, status } = req.body;
        if (!projectName || !projectNumber || !description || !status) {
            throw new validation_error_1.default("All project fields are required");
        }
        const project = await Project_1.default.create({ projectName, projectNumber, description, status });
        res.status(201).json(project);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project_1.default.find();
        res.status(200).json(projects);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res, next) => {
    try {
        const projectNumber = req.params.projectNumber; // Changed from projectId to projectNumber
        const project = await Project_1.default.findOne({ projectNumber }); // Changed from findById to findOne
        if (!project) {
            throw new not_found_error_1.default("Project not found");
        }
        res.status(200).json(project);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res, next) => {
    try {
        const projectNumber = req.params.projectNumber;
        const { projectName, description, status } = req.body;
        if (!projectName || !projectNumber || !description || !status) {
            throw new validation_error_1.default("All project fields are required");
        }
        const updatedProject = await Project_1.default.findOneAndUpdate({ projectNumber }, { projectName, projectNumber, description, status }, { new: true, runValidators: true });
        if (!updatedProject) {
            throw new not_found_error_1.default("Project not found");
        }
        res.status(200).json(updatedProject);
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        const projectNumber = req.params.projectNumber; // Changed from projectId to projectNumber
        const deletedProject = await Project_1.default.findOneAndDelete({ projectNumber }); // Changed from findByIdAndDelete to findOneAndDelete
        if (!deletedProject) {
            throw new not_found_error_1.default("Project not found");
        }
        res.status(200).send();
        return;
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.js.map