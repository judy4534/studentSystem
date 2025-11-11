
import express from 'express';
import ProfessorCourseAssignment from '../models/ProfessorCourseAssignment.js';

export const getAllAssignments = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const assignments = await ProfessorCourseAssignment.find({});
        res.status(200).json({ success: true, data: assignments });
    } catch (error) {
        next(error);
    }
};