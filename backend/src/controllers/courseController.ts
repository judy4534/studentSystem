
import express from 'express';
import Course from '../models/Course.js';
import ProfessorCourseAssignment from '../models/ProfessorCourseAssignment.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getAllCourses = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const courses = await Course.find({}).populate('department', 'name');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// @desc    Get courses by professor
// @route   GET /api/courses/professor/:professorId
// @access  Private/Admin/Professor
export const getCoursesByProfessor = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const assignments = await ProfessorCourseAssignment.find({ professor: req.params.professorId }).populate('course');
        const courses = assignments.map((a: any) => a.course);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        next(error);
    }
};