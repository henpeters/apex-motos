# Apex Motors — Auto Parts & Garage Shop E-Commerce Platform

A production-ready, dynamic, dark-luxury e-commerce ecosystem and garage diagnostic management system designed for **Apex Motors**. Built with **React, TypeScript, Vite, Tailwind CSS, Node.js, Express, and MongoDB**, with ready-to-deploy configuration for **Render** and **MongoDB Atlas**.

---

## 🌟 System Overview

The project consists of three independently deployable applications:

1. **Customer-Facing Frontend (`/frontend`)**:
   - Liquid glass & dark obsidian UI aesthetics with racing red highlights.
   - Interactive **Vehicle Fitment Finder** (Year / Make / Model compatibility selector).
   - Dynamic product search, category filtering, price range slider, stock availability filter, sorting, and pagination.
   - High-res product gallery, technical specifications tab, and compatible vehicle tables.
   - LocalStorage persistent shopping cart drawer and multi-step checkout flow.
   - Garage service booking modal and contact form submission directly linked to the database.

2. **Separate Admin Dashboard (`/admin`)**:
   - Protected application guarded by JWT authentication and role authorization.
   - Executive analytics dashboard featuring total revenue, total orders, low stock warnings, unread messages, and interactive monthly sales charts.
   - Product Management: Full CRUD, SKU generator, category assignment, pricing, image uploads, specifications builder, and vehicle fitment rule manager.
   - Category Management: Create, edit, publish, and assign imagery.
   - Order Management: Search, status filtering, order items modal, and status dropdown updates (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
   - Garage Services, Hero Slides, Testimonials, and Contact Messages Inbox portals.

3. **Backend REST API (`/backend`)**:
   - Node.js & Express API with TypeScript, Mongoose, JWT, bcrypt password hashing, and Multer file upload handling.
   - Integrated `mongodb-memory-server` engine fallback for out-of-the-box local execution if no local MongoDB instance or Atlas URI is provided.
   - Comprehensive seed script populating 15 categories, 30 realistic auto parts with fitment tables, 8 garage services, 5 testimonials, 3 hero slides, and the seed admin account.

---

## 📁 Monorepo Directory Structure

```
e-com/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection & env setup
│   │   ├── controllers/     # Auth, Product, Category, Order, Service, Message, Hero, Testimonial, Stats
│   │   ├── middleware/      # Auth JWT, Admin check, Upload middleware
│   │   ├── models/          # User, Product, Category, Order, Service, Message, HeroSlide, Testimonial
│   │   ├── routes/          # REST API endpoints
│   │   ├── seed/            # Seeder script populating 30 products, 15 categories, 8 services, admin user
│   │   └── server.ts        # Express app entry point
│   ├── uploads/             # File upload directory
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   │   └── _redirects       # Render SPA rewrite rule
│   ├── src/
│   │   ├── components/      # Navbar, Footer, FitmentBar, ProductCard, CartDrawer, Modals
│   │   ├── context/         # AuthContext, CartContext, FitmentContext
│   │   ├── pages/           # Home, Store, ProductDetail, Cart, Checkout, Services, About, Contact
│   │   ├── services/        # Axios API client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── admin/
│   ├── public/
│   │   └── _redirects       # Render SPA rewrite rule
│   ├── src/
│   │   ├── components/      # AdminLayout, ProtectedRoute
│   │   ├── context/         # AdminAuthContext
│   │   ├── pages/           # DashboardHome, Products, Categories, Orders, Services, HeroSlides, Testimonials, Messages, AdminLogin
│   │   ├── services/        # Admin API client
│   │   ├── types/           # Admin TypeScript interfaces
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── package.json             # Root monorepo scripts
├── render.yaml              # Render deployment blueprint
└── README.md
```

---

## 🔑 Development Admin Credentials

> [!WARNING]
> **Production Security Requirement**: The credentials below are provided for initial development testing only. Please change the password in production before deployment!

- **Admin Login Email**: `admin@apexmotors.com`
- **Admin Password**: `admin123`
- **Customer Demo Email**: `customer@apexmotors.com`
- **Customer Password**: `customer123`

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies & Seed Database
From the root workspace directory, run:

```bash
# Seed backend database with realistic auto parts, categories, services, and admin account
npm run seed
```

### 2. Start Applications
Run the three applications concurrently or individually:

```bash
# Start Backend REST API (Port 5000)
npm run dev:backend

# Start Customer Frontend (Port 3000)
npm run dev:frontend

# Start Admin Dashboard (Port 3001)
npm run dev:admin
```

Open your browser at:
- **Customer Website**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`
- **Backend API Health**: `http://localhost:5000/api/health`

---

## ⚙️ Environment Variables Documentation

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/apex_motors
JWT_SECRET=apex_motors_super_secret_jwt_key_2026_auto_garage
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Admin (`admin/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ☁️ Deployment Instructions for Render

### Render Blueprint Deployment
1. Connect your repository to **Render**.
2. Render will automatically detect `render.yaml` and create 3 services:
   - `apex-auto-parts-api` (Node Web Service)
   - `apex-auto-parts-frontend` (Static Site with SPA rewrite rules)
   - `apex-auto-parts-admin` (Static Site with SPA rewrite rules)
3. Set the `MONGODB_URI` environment variable on `apex-auto-parts-api` to your **MongoDB Atlas** cluster connection string.
4. Set `VITE_API_URL` on the frontend and admin static sites to `https://apex-auto-parts-api.onrender.com/api`.

---

## ✅ Production Readiness Verification

- [x] All 3 applications (Backend, Customer Frontend, Admin Dashboard) compile cleanly without errors.
- [x] `mongodb-memory-server` fallback ensures 100% out-of-the-box execution.
- [x] Seed script populates 15 categories, 30 products with real specifications & vehicle fitment tables, 8 services, 5 testimonials, and 3 hero slides.
- [x] Responsive layout tested across desktop, tablet, and mobile viewports.
- [x] Render SPA route rewrites configured via `_redirects` and `render.yaml`.
