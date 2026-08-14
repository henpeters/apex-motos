import { Router, Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, adminOnly, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    // Return relative URL for uploaded asset
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl, filename: req.file.filename });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
});

export default router;
