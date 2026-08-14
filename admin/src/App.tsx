import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';

import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import DashboardHome from './pages/DashboardHome';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminServices from './pages/AdminServices';
import AdminHeroSlides from './pages/AdminHeroSlides';
import AdminTestimonials from './pages/AdminTestimonials';
import AdminMessages from './pages/AdminMessages';

const App: React.FC = () => {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />

          {/* Guarded Admin Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardHome />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/services" element={<AdminServices />} />
              <Route path="/admin/hero-slides" element={<AdminHeroSlides />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
            </Route>
          </Route>

          {/* Catch-all redirect to /admin */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
};

export default App;
