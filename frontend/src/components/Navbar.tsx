import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, ShieldCheck, Wrench, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFitment } from '../context/FitmentContext';
import SearchModal from './SearchModal';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { fitment, isVehicleSelected, clearFitment } = useFitment();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-header-scrolled py-3' : 'glass-header py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center shadow-redGlow group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl tracking-wider text-white flex items-center gap-1">
                  APEX <span className="text-brand-red">MOTORS</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-medium uppercase -mt-1">
                  Parts & Garage Shop
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full shadow-redGlow" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions: Fitment Badge, Search, Cart, CTA */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Vehicle Fitment Indicator */}
              {isVehicleSelected && (
                <div
                  onClick={() => navigate('/store')}
                  className="hidden xl:flex items-center gap-2 bg-brand-red/10 border border-brand-red/30 px-3 py-1.5 rounded-full text-xs text-slate-200 cursor-pointer hover:bg-brand-red/20 transition-all"
                  title="Click to view compatible parts"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-red" />
                  <span className="font-semibold text-white">
                    {fitment.year} {fitment.make} {fitment.model}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFitment();
                    }}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Search Store"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-red text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-redGlow animate-pulse">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* CTA Button */}
              <Link
                to="/services"
                className="hidden sm:inline-flex btn-primary px-4 py-2 text-xs uppercase tracking-wider items-center gap-2"
              >
                <Wrench className="w-3.5 h-3.5" />
                Book Service
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 mt-3 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-300">
            {isVehicleSelected && (
              <div className="flex items-center justify-between bg-brand-red/10 border border-brand-red/30 px-3 py-2 rounded-lg text-xs text-white">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-red" />
                  Fitment: {fitment.year} {fitment.make} {fitment.model}
                </span>
                <button onClick={clearFitment} className="text-slate-400 hover:text-white font-bold">
                  Clear
                </button>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                to="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full py-3 text-center text-sm font-semibold uppercase tracking-wider"
              >
                Shop Auto Parts
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full py-3 text-center text-sm font-semibold uppercase tracking-wider"
              >
                Book Garage Service
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Navbar;
