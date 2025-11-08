// Fix: Import Request, Response, NextFunction from express
import { Request, Response, NextFunction } from 'express';
import Enrollment from '../models/Enrollment';
import Semester from '../models/Semester';

// Fix: Add express types to function signature
export const getAllEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await Enrollment.find({})
            .populate('student', 'name studentId')
            .populate('course', 'name code')
            .populate('semester', 'name');
        res.status(200).json({ success: true, data: enrollments });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const enrollStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, courseId } = req.body;
    try {
        const openSemester = await Semester.findOne({ status: 'مفتوح' });
        if (!openSemester) {
            return res.status(400).json({ success: false, message: 'Registration is currently closed' });
        }
        const enrollment = await Enrollment.create({
            student: studentId,
            course: courseId,
            semester: openSemester._id,
        });
        res.status(201).json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const updateGrade = async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, courseId, courseworkGrade, finalGrade } = req.body;
    try {
        const openSemester = await Semester.findOne({ status: 'مفتوح' });
        if (!openSemester) {
            return res.status(400).json({ success: false, message: 'Cannot update grades for a closed semester' });
        }

        const enrollment = await Enrollment.findOneAndUpdate(
            { student: studentId, course: courseId, semester: openSemester._id },
            { $set: { courseworkGrade, finalGrade } },
            { new: true }
        );

        if (!enrollment) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }

        res.status(200).json({ success: true, data: enrollment });
    } catch (error) {
        next(error);
    }
};

// Fix: Add express types to function signature
export const unenrollStudent = async (req: Request, res: Response, next: NextFunction) => {
    const { studentId, courseId } = req.body;
     try {
        const openSemester = await Semester.findOne({ status: 'مفتوح' });
        if (!openSemester) {
            return res.status(400).json({ success: false, message: 'Cannot unenroll from a closed semester' });
        }
        const result = await Enrollment.deleteOne({ student: studentId, course: courseId, semester: openSemester._id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Enrollment not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};