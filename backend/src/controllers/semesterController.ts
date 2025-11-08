// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';
import Semester from '../models/Semester';

// Fix: Add express types to function signature
export const getAllSemesters = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const semesters = await Semester.find({}).sort({ startDate: -1 });
        res.status(200).json({ success: true, data: semesters });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const createSemester = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const semester = await Semester.create(req.body);
        res.status(201).json({ success: true, data: semester });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const updateSemester = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const semester = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!semester) {
            return res.status(404).json({ success: false, message: 'Semester not found' });
        }
        res.status(200).json({ success: true, data: semester });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const deleteSemester = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const semester = await Semester.findByIdAndDelete(req.params.id);
        if (!semester) {
            return res.status(404).json({ success: false, message: 'Semester not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};