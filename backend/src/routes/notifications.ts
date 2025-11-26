
import express from 'express';
import { 
    getAllNotifications, 
    markAsRead, 
    markAllAsRead,
    createReminderNotification
} from '../controllers/notificationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, getAllNotifications);

router.post('/read-all', protect, markAllAsRead);
router.post('/remind', protect, authorize('admin'), createReminderNotification);
router.post('/:id/read', protect, markAsRead);


export default router;