import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Checks if Cloudinary credentials are set in environment variables.
 * Supports individual keys OR a single CLOUDINARY_URL string.
 */
export const isCloudinaryConfigured = (): boolean => {
  if (process.env.CLOUDINARY_URL) return true;
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

const cleanEnv = (val?: string) => val ? val.replace(/[<>'"]/g, '').trim() : '';

// Configure Cloudinary dynamically if present
const initCloudinary = () => {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ cloudinary_url: cleanEnv(process.env.CLOUDINARY_URL) });
  } else if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: cleanEnv(process.env.CLOUDINARY_CLOUD_NAME),
      api_key: cleanEnv(process.env.CLOUDINARY_API_KEY),
      api_secret: cleanEnv(process.env.CLOUDINARY_API_SECRET),
    });
  }
};

// Local disk fallback directory
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

function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = /jpg|jpeg|png|webp|gif|mp4|heic/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
  if (extOk || mimeOk) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPG, PNG, WEBP, GIF, HEIC) are allowed!'));
}

// Multer configured with memory storage if Cloudinary, disk storage otherwise
export const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage by default to easily upload to Cloudinary
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter(_req, file, cb) {
    checkFileType(file, cb);
  },
});

/**
 * Handles file upload to Cloudinary or falls back to local disk saving.
 * Returns the public HTTPS URL of the uploaded image.
 */
export const handleFileUpload = async (file: Express.Multer.File): Promise<string> => {
  initCloudinary();

  if (isCloudinaryConfigured() && file.buffer) {
    console.log('[Upload] Uploading image buffer to Cloudinary...');
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'apex-motors',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('[Upload] Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(file.buffer);
    });

    console.log('[Upload] Cloudinary upload success. URL:', result.secure_url);
    return result.secure_url;
  }

  // Fallback: Save memory buffer to local disk
  console.warn('[Upload] Cloudinary environment variables NOT found. Saving to temporary local disk fallback...');
  const ext = path.extname(file.originalname) || '.jpg';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${filename}`;
};
