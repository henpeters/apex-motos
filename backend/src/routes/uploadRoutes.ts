import { Router, Request, Response } from 'express';
import { upload, handleFileUpload } from '../middleware/uploadMiddleware';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded. Please select an image file.' });
        return;
      }

      const fileUrl = await handleFileUpload(req.file);
      res.status(200).json({ url: fileUrl, filename: req.file.originalname });
    } catch (error: any) {
      console.error('[Upload] Error:', error);
      res.status(500).json({ message: error.message || 'File upload failed' });
    }
  }
);

export default router;
