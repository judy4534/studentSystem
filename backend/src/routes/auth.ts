import express from 'express';
import { login, getProfile, logout } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/logout', logout); // This would be for invalidating tokens if using a blacklist

export default router;
