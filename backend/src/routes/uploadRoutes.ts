import { Router, Request, Response } from 'express';
import { upload, handleFileUpload, isCloudinaryConfigured } from '../middleware/uploadMiddleware';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// Endpoint to verify Cloudinary configuration status
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    cloudinaryConfigured: isCloudinaryConfigured(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Present' : 'Missing',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing',
  });
});

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
      console.error('[Upload API Error]', error);
      res.status(500).json({ message: error.message || 'File upload failed' });
    }
  }
);

export default router;
