import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import { autoSeedIfEmpty } from './services/seedService';

dotenv.config();

// Route imports
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import serviceRoutes from './routes/serviceRoutes';
import messageRoutes from './routes/messageRoutes';
import heroRoutes from './routes/heroRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import statsRoutes from './routes/statsRoutes';
import uploadRoutes from './routes/uploadRoutes';

const app = express();

// Connect to MongoDB Database and auto-seed if empty
connectDB().then(() => {
  autoSeedIfEmpty();
});

// CORS configuration allowing connections from Frontend and Admin apps
app.use(
  cors({
    origin: '*', // Allow all during dev; set specific origins in prod
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static directory for uploaded files
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Static directory for root media files (videos & images)
const rootMediaPath = path.join(__dirname, '../../');
app.use('/media', express.static(rootMediaPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/hero-slides', heroRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Apex Motors REST API is operational' });
});

// 404 Route handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Apex Motors API server running on port ${PORT}`);
});
