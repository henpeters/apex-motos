import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// ─── Cloudinary Config ──────────────────────────────────────────────────────
const useCloudinary =
  !!(process.env.CLOUDINARY_CLOUD_NAME &&
     process.env.CLOUDINARY_API_KEY &&
     process.env.CLOUDINARY_API_SECRET);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Upload] Cloudinary storage configured.');
} else {
  console.log('[Upload] Cloudinary env vars not set — falling back to local disk storage.');
}

// ─── Local Disk Fallback ─────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  },
});

// ─── File Filter ─────────────────────────────────────────────────────────────
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = /jpg|jpeg|png|webp|gif|mp4/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpg, jpeg, png, webp, gif) and mp4 videos are allowed!'));
}

// ─── Multer Instance (memory when Cloudinary, disk otherwise) ─────────────────
export const upload = multer({
  storage: useCloudinary ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter(_req, file, cb) {
    checkFileType(file, cb);
  },
});

// ─── Upload Handler ───────────────────────────────────────────────────────────
/**
 * Uploads a file buffer to Cloudinary or saves it to disk.
 * Returns the public URL of the stored file.
 */
export const handleFileUpload = async (file: Express.Multer.File): Promise<string> => {
  if (useCloudinary && file.buffer) {
    // Upload buffer to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'apex-motors',
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    return result.secure_url;
  } else {
    // Local disk — file was already saved by multer diskStorage
    return `/uploads/${file.filename}`;
  }
};
