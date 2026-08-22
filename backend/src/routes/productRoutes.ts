import { Router } from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  renderProductShareHtml,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id/share', renderProductShareHtml);
router.get('/:id', getProductByIdOrSlug);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
