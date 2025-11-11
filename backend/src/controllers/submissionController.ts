
import express from 'express';
import CourseSubmission from '../models/CourseSubmission.js';
import Enrollment from '../models/Enrollment.js';
import Semester from '../models/Semester.js';

export const getAllSubmissions = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const submissions = await CourseSubmission.find({});
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        next(error);
    }
};

export const createSubmission = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { courseId } = req.body;
    try {
        const openSemester = await Semester.findOne({ status: 'مفتوح' });
        if (!openSemester) {
            return res.status(400).json({ success: false, message: 'Cannot submit grades for a closed semester' });
        }

        // Mark all students as 'completed'
        await Enrollment.updateMany(
            { course: courseId, semester: openSemester._id, status: 'enrolled' },
            { status: 'completed' }
        );

        const submission = await CourseSubmission.create({
            course: courseId,
            semester: openSemester._id,
            professor: req.user!._id,
        });
        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};