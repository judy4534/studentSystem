
import express from 'express';
import { getAllAuditLogs } from '../controllers/auditLogController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllAuditLogs);

export default router;