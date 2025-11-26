
import express from 'express';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllDepartments)
    .post(protect, authorize('admin'), createDepartment);

router.route('/:id')
    .put(protect, authorize('admin'), updateDepartment)
    .delete(protect, authorize('admin'), deleteDepartment);

export default router;