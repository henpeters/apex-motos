import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FitmentProvider } from './context/FitmentContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FitmentProvider>
        <CartProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-brand-red selection:text-white">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store" element={<Store />} />
                  <Route path="/store/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  {/* Catch-all fallback */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <CartDrawer />
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </FitmentProvider>
    </AuthProvider>
  );
};

export default App;
