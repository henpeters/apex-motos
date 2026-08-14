import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, adminOnly, getOrderById);
router.put('/:id', protect, adminOnly, updateOrderStatus);

export default router;
