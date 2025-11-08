// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';
import ProfessorCourseAssignment from '../models/ProfessorCourseAssignment';

// Fix: Add express types to function signature
export const getAllAssignments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assignments = await ProfessorCourseAssignment.find({});
        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        next(error);
    }
};