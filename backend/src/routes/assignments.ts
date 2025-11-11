
import express from 'express';
import { getAllAssignments } from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllAssignments);

export default router;