
import express from 'express';
import RegistrationRequest from '../models/Request';
import Enrollment from '../models/Enrollment';
import Semester from '../models/Semester';

export const getAllRequests = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const requests = await RegistrationRequest.find({})
            .populate('student', 'name studentId')
            .populate('course', 'name code');
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

export const createRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { studentId, courseId, requestType } = req.body;
    try {
        const request = await RegistrationRequest.create({
            student: studentId,
            course: courseId,
            requestType,
        });
        res.status(201).json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

export const approveRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const request = await RegistrationRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        const openSemester = await Semester.findOne({ status: 'مفتوح' });
        if (!openSemester) {
            return res.status(400).json({ success: false, message: 'Cannot approve request, registration is closed' });
        }

        await Enrollment.create({
            student: request.student,
            course: request.course,
            semester: openSemester._id,
        });

        request.status = 'approved';
        await request.save();

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

export const rejectRequest = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const request = await RegistrationRequest.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};