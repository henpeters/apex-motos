import axios from 'axios';
import {
  Product,
  Category,
  Service,
  HeroSlide,
  Testimonial,
  Order,
  CustomerInfo,
  User,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Derives the backend origin (strips trailing /api) to build media URLs.
// In dev the Vite proxy handles /media → localhost:5000, so we use ''.
// In production VITE_API_URL = https://your-api.onrender.com/api, so we strip /api.
export const MEDIA_BASE =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : '';

/**
 * Resolves a /media/... or /uploads/... path to an absolute URL.
 * Works in both dev (empty prefix → Vite proxy) and production.
 */
export const getMediaUrl = (path: string): string => {
  if (!path) return '';
  // Already absolute (http/https) — return as-is
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_customer_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async (params?: Record<string, any>) => {
  const response = await api.get<{
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
  }>('/products', { params });
  return response.data;
};

export const getProductById = async (idOrSlug: string) => {
  const response = await api.get<{ product: Product; relatedProducts: Product[] }>(`/products/${idOrSlug}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};

export const getServices = async () => {
  const response = await api.get<Service[]>('/services');
  return response.data;
};

export const getHeroSlides = async () => {
  const response = await api.get<HeroSlide[]>('/hero-slides');
  return response.data;
};

export const getTestimonials = async () => {
  const response = await api.get<Testimonial[]>('/testimonials');
  return response.data;
};

export const createOrder = async (orderData: {
  customerInfo: CustomerInfo;
  items: any[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
}) => {
  const response = await api.post<Order>('/orders', orderData);
  return response.data;
};

export const sendContactMessage = async (messageData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post<User>('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: { name: string; email: string; password: string; phone?: string }) => {
  const response = await api.post<User>('/auth/register', userData);
  return response.data;
};

export default api;
