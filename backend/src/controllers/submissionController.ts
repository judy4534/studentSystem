// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';
import CourseSubmission from '../models/CourseSubmission';
import Enrollment from '../models/Enrollment';
import Semester from '../models/Semester';

// Fix: Add express types to function signature
export const getAllSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = await CourseSubmission.find({});
        res.status(200).json({ success: true, data: submissions });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const createSubmission = async (req: Request, res: Response, next: NextFunction) => {
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