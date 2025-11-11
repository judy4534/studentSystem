
import express from 'express';
import { getAllSubmissions, createSubmission } from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllSubmissions)
    .post(protect, authorize('professor'), createSubmission);

export default router;