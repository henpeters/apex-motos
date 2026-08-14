import { Router } from 'express';
import {
  getServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getServices);
router.get('/:id', getServiceByIdOrSlug);

// Admin routes
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;
