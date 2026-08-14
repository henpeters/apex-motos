export interface VehicleCompatibility {
  make: string;
  model: string;
  yearStart: number;
  yearEnd: number;
  notes?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  itemCount?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: Category | string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  specifications: Specification[];
  images: string[];
  compatibility: VehicleCompatibility[];
  rating: number;
  numReviews: number;
  featured: boolean;
  bestseller: boolean;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  deliveryInstructions?: string;
}

export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  active: boolean;
  featured: boolean;
}

export interface Testimonial {
  _id: string;
  customerName: string;
  customerRole: string;
  customerImage?: string;
  rating: number;
  comment: string;
  active: boolean;
}

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  phone?: string;
  token?: string;
}

export interface FitmentFilter {
  make: string;
  model: string;
  year: string;
}
