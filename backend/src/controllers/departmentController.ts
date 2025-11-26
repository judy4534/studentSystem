
import express from 'express';
import Department from '../models/Department';
import Course from '../models/Course';
import User from '../models/User';

export const getAllDepartments = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const departments = await Department.find({});
        // Dynamically calculate counts
        const departmentsWithCounts = await Promise.all(departments.map(async (dept: any) => {
            const courseCount = await Course.countDocuments({ department: dept._id });
            const studentCount = await User.countDocuments({ role: 'student', department: dept._id });
            return {
                id: dept._id,
                _id: dept._id,
                name: dept.name,
                head: dept.head,
                courseCount,
                studentCount,
                createdAt: dept.createdAt,
                updatedAt: dept.updatedAt,
            };
        }));
        res.status(200).json({ success: true, data: departmentsWithCounts });
    } catch (error) {
        next(error);
    }
};

export const createDepartment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const department = await Department.create(req.body);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

export const updateDepartment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        next(error);
    }
};

export const deleteDepartment = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};