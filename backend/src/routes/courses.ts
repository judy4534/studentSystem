import express from 'express';
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByProfessor,
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, getAllCourses)
    .post(protect, authorize('admin'), createCourse);

router.route('/:id')
    .get(protect, getCourseById)
    .put(protect, authorize('admin'), updateCourse)
    .delete(protect, authorize('admin'), deleteCourse);
    
router.get('/professor/:professorId', protect, authorize('admin', 'professor'), getCoursesByProfessor);

export default router;
