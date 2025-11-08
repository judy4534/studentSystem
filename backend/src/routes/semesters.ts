import express from 'express';
import {
    getAllSemesters,
    createSemester,
    updateSemester,
    deleteSemester
} from '../controllers/semesterController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllSemesters)
    .post(protect, authorize('admin'), createSemester);

router.route('/:id')
    .put(protect, authorize('admin'), updateSemester)
    .delete(protect, authorize('admin'), deleteSemester);

export default router;
