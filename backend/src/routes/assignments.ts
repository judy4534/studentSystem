import express from 'express';
import { getAllAssignments } from '../controllers/assignmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllAssignments);

export default router;
