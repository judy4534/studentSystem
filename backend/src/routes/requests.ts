
import express from 'express';
import {
    getAllRequests,
    createRequest,
    approveRequest,
    rejectRequest
} from '../controllers/requestController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllRequests)
    .post(protect, authorize('student'), createRequest);

router.post('/:id/approve', protect, authorize('admin'), approveRequest);
router.post('/:id/reject', protect, authorize('admin'), rejectRequest);

export default router;