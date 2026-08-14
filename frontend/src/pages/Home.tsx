import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  ShieldCheck,
  Award,
  Truck,
  ArrowRight,
  ChevronRight,
  Star,
  Sparkles,
  Zap,
} from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import FitmentBar from '../components/FitmentBar';
import ProductCard from '../components/ProductCard';
import BookingModal from '../components/BookingModal';
import { getProducts, getCategories, getServices, getTestimonials, getHeroSlides, getMediaUrl } from '../services/api';
import { Product, Category, Service, Testimonial, HeroSlide } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, servRes, testRes, heroRes] = await Promise.all([
          getProducts({ limit: 8, featured: 'true' }),
          getCategories(),
          getServices(),
          getTestimonials(),
          getHeroSlides(),
        ]);
        setProducts(prodRes.products);
        setCategories(catRes.slice(0, 10));
        setServices(servRes.slice(0, 4));
        setTestimonials(testRes);
        setHeroSlides(heroRes);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100">
      {/* 1. HERO SLIDESHOW SECTION */}
      <HeroSlider slides={heroSlides} />

      {/* 2. VEHICLE FITMENT FINDER BAR */}
      <FitmentBar />

      {/* 3. FEATURED CATEGORIES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Catalog Overview</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Featured <span className="text-gradient-red">Categories</span>
            </h2>
          </div>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-brand-red transition-colors mt-4 md:mt-0"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/store?category=${cat.slug}`}
                className="glass-panel glass-panel-hover p-4 rounded-2xl flex flex-col items-center text-center group border border-white/10 relative overflow-hidden block"
              >
                <div className="w-full h-32 rounded-xl bg-slate-950/80 overflow-hidden mb-3 p-2 flex items-center justify-center">
                  <img
                    src={getMediaUrl(cat.image || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg')}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-heading font-bold text-white text-sm group-hover:text-brand-red transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {cat.itemCount ? `${cat.itemCount} Parts` : 'Explore'}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4" />
              <span>High Performance Engineering</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Featured <span className="text-gradient-red">Auto Parts</span>
            </h2>
          </div>
          <Link
            to="/store"
            className="btn-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mt-4 md:mt-0 shadow-redGlow"
          >
            <span>Explore Full Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-panel h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. PROMOTIONAL BANNER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-brand-red/30 p-8 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red/20 via-black/80 to-slate-950/90 z-10" />
          <img
            src="/media/dayronv-nissan-885309_1920.jpg"
            alt="Promotional Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="relative z-20 max-w-xl space-y-4">
            <span className="inline-block bg-brand-red text-white text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-redGlow">
              SEASONAL TRACK PROMOTION
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-none">
              UP TO <span className="text-brand-red">30% OFF</span> PERFORMANCE BRAKES & FILTERS
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Upgrade your track vehicle stopping distance with Brembo GT-R 6-piston brake kits and Akebono ceramic composite pads.
            </p>
            <div className="pt-2">
              <Link
                to="/store?category=brake-systems"
                className="btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-redGlow"
              >
                <span>Shop Promotion Deals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GARAGE SERVICES PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
            <Wrench className="w-4 h-4" />
            <span>Master Garage Diagnostics</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Professional <span className="text-gradient-red">Garage Services</span>
          </h2>
          <p className="text-slate-400 text-sm">
            State-of-the-art diagnostic equipment, ASE Master Certified technicians, and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-full h-40 rounded-xl bg-slate-950 overflow-hidden">
                  <img
                    src={getMediaUrl(service.image || '/media/life-of-pix-cylinders-569151_1920.jpg')}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-heading font-bold text-white text-lg group-hover:text-brand-red transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Starting From</span>
                  <span className="font-heading font-extrabold text-xl text-white">${service.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleBookService(service)}
                  className="btn-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-brand-red hover:text-brand-red"
                >
                  Book Service
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-bold text-sm text-slate-300 hover:text-brand-red transition-colors"
          >
            <span>View All Garage Diagnostics & Repair Services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 7. WHY CHOOSE US */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">Genuine OEM Parts</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every part in our store is sourced directly from certified manufacturers with full factory warranties.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red mx-auto sm:mx-0">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">Same-Day Dispatch</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Orders placed before 3 PM EST ship same day with real-time tracking across North America.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red mx-auto sm:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">ASE Master Certified</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Our technicians have over 10 years of combined track diagnostic and engine tuning experience.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red mx-auto sm:mx-0">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-white text-base">Fitment Guarantee</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Use our fitment finder tool for a 100% vehicle compatibility guarantee or return free.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
            <Star className="w-4 h-4 fill-brand-red" />
            <span>Driver Reviews</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            What Our <span className="text-gradient-red">Customers Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center font-heading font-bold text-white text-sm uppercase">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">{t.customerName}</h4>
                  <span className="text-[11px] text-slate-400 block">{t.customerRole}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {bookingOpen && (
        <BookingModal
          service={selectedService}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
