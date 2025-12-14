import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/auth.controller';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router.route('/users')
  .get(protect, isAdmin, getUsers);

router.route('/users/:id')
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

export default router;
