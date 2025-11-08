import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getAllUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/:id')
    .get(protect, authorize('admin'), getUserById)
    .put(protect, authorize('admin'), updateUser) // Or allow users to update their own profile
    .delete(protect, authorize('admin'), deleteUser);

export default router;
