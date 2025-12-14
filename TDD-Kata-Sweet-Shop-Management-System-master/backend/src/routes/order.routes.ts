import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
  getMonthlyIncome,
} from '../controllers/order.controller';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes (none for orders)

// Protected routes
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, isAdmin, getOrders);

router.route('/myorders').get(protect, getMyOrders);
router.route('/income').get(protect, isAdmin, getMonthlyIncome);

router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, isAdmin, deleteOrder);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);

export default router;
