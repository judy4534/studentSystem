import express from 'express';
import {
    getAllEnrollments,
    enrollStudent,
    unenrollStudent,
    updateGrade
} from '../controllers/enrollmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllEnrollments)
    .post(protect, authorize('admin', 'student'), enrollStudent)
    .delete(protect, authorize('admin', 'student'), unenrollStudent);

router.patch('/grade', protect, authorize('admin', 'professor'), updateGrade);

export default router;
