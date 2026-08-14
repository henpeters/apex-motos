import { Router } from 'express';
import {
  createMessage,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} from '../controllers/messageController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', createMessage);

// Admin routes
router.get('/', protect, adminOnly, getMessages);
router.put('/:id', protect, adminOnly, toggleMessageRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
