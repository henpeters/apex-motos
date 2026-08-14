import { Router } from 'express';
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from '../controllers/heroController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getHeroSlides);

// Admin routes
router.post('/', protect, adminOnly, createHeroSlide);
router.put('/:id', protect, adminOnly, updateHeroSlide);
router.delete('/:id', protect, adminOnly, deleteHeroSlide);

export default router;
