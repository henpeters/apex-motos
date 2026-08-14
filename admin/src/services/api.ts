import axios from 'axios';
import {
  Product,
  Category,
  Order,
  Service,
  Message,
  HeroSlide,
  Testimonial,
  DashboardStats,
  AdminUser,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const MEDIA_BASE =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : '';

export const getMediaUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE}${path}`;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('apex_admin_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Auth
export const loginAdmin = async (credentials: { email: string; password: string }) => {
  const response = await api.post<AdminUser>('/auth/login', credentials);
  if (response.data.role !== 'admin') {
    throw new Error('Access denied: User is not an administrator');
  }
  return response.data;
};

// Analytics Stats
export const getStats = async () => {
  const response = await api.get<DashboardStats>('/stats');
  return response.data;
};

// Product Management
export const getProducts = async (params?: Record<string, any>) => {
  const response = await api.get<{
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
  }>('/products', { params: { ...params, includeInactive: true } });
  return response.data;
};

export const createProduct = async (productData: Partial<Product>) => {
  const response = await api.post<Product>('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await api.put<Product>(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Category Management
export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories', { params: { includeInactive: true } });
  return response.data;
};

export const createCategory = async (catData: Partial<Category>) => {
  const response = await api.post<Category>('/categories', catData);
  return response.data;
};

export const updateCategory = async (id: string, catData: Partial<Category>) => {
  const response = await api.put<Category>(`/categories/${id}`, catData);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Order Management
export const getOrders = async (params?: Record<string, any>) => {
  const response = await api.get<{
    orders: Order[];
    total: number;
    pages: number;
    currentPage: number;
  }>('/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (id: string, statusData: { orderStatus?: string; paymentStatus?: string }) => {
  const response = await api.put<Order>(`/orders/${id}`, statusData);
  return response.data;
};

// Service Management
export const getServices = async () => {
  const response = await api.get<Service[]>('/services', { params: { includeInactive: true } });
  return response.data;
};

export const createService = async (serviceData: Partial<Service>) => {
  const response = await api.post<Service>('/services', serviceData);
  return response.data;
};

export const updateService = async (id: string, serviceData: Partial<Service>) => {
  const response = await api.put<Service>(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Message Management
export const getMessages = async () => {
  const response = await api.get<Message[]>('/messages');
  return response.data;
};

export const toggleMessageRead = async (id: string, read?: boolean) => {
  const response = await api.put<Message>(`/messages/${id}`, { read });
  return response.data;
};

export const deleteMessage = async (id: string) => {
  const response = await api.delete(`/messages/${id}`);
  return response.data;
};

// Hero Slide Management
export const getHeroSlides = async () => {
  const response = await api.get<HeroSlide[]>('/hero-slides', { params: { includeInactive: true } });
  return response.data;
};

export const createHeroSlide = async (slideData: Partial<HeroSlide>) => {
  const response = await api.post<HeroSlide>('/hero-slides', slideData);
  return response.data;
};

export const updateHeroSlide = async (id: string, slideData: Partial<HeroSlide>) => {
  const response = await api.put<HeroSlide>(`/hero-slides/${id}`, slideData);
  return response.data;
};

export const deleteHeroSlide = async (id: string) => {
  const response = await api.delete(`/hero-slides/${id}`);
  return response.data;
};

// Testimonial Management
export const getTestimonials = async () => {
  const response = await api.get<Testimonial[]>('/testimonials', { params: { includeInactive: true } });
  return response.data;
};

export const createTestimonial = async (tData: Partial<Testimonial>) => {
  const response = await api.post<Testimonial>('/testimonials', tData);
  return response.data;
};

export const updateTestimonial = async (id: string, tData: Partial<Testimonial>) => {
  const response = await api.put<Testimonial>(`/testimonials/${id}`, tData);
  return response.data;
};

export const deleteTestimonial = async (id: string) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};

// Image Upload Endpoint
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export default api;
