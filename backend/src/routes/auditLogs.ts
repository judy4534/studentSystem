
import express from 'express';
import { getAllAuditLogs } from '../controllers/auditLogController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllAuditLogs);

export default router;