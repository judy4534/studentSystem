
import express from 'express';
import {
    getAllSemesters,
    createSemester,
    updateSemester,
    deleteSemester
} from '../controllers/semesterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllSemesters)
    .post(protect, authorize('admin'), createSemester);

router.route('/:id')
    .put(protect, authorize('admin'), updateSemester)
    .delete(protect, authorize('admin'), deleteSemester);

export default router;