import express from 'express';
import {
  getSweets,
  getSweetById,
  createSweet,
  updateSweet,
  deleteSweet,
  createSweetReview,
  getTopSweets,
  updateSweetStock,
} from '../controllers/sweet.controller';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.route('/').get(getSweets);
router.get('/top', getTopSweets);
router.route('/:id').get(getSweetById);

// Protected routes
router.route('/:id/reviews').post(protect, createSweetReview);

// Admin routes
router.route('/').post(protect, isAdmin, createSweet);
router
  .route('/:id')
  .put(protect, isAdmin, updateSweet)
  .delete(protect, isAdmin, deleteSweet);

// Stock management
router.route('/:id/stock').patch(protect, isAdmin, updateSweetStock);

export default router;
