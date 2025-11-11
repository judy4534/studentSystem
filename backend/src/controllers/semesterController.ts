
import express from 'express';
import Semester from '../models/Semester.js';

export const getAllSemesters = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const semesters = await Semester.find({}).sort({ startDate: -1 });
        res.status(200).json({ success: true, data: semesters });
    } catch (error) {
        next(error);
    }
};

export const createSemester = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const semester = await Semester.create(req.body);
        res.status(201).json({ success: true, data: semester });
    } catch (error) {
        next(error);
    }
};

export const updateSemester = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export const deleteSemester = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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