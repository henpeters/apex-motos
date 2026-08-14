import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeroSlide } from '../types';

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const fallbackSlides: HeroSlide[] = [
  {
    _id: '1',
    title: 'PREMIUM AUTO PARTS. BUILT FOR THE ROAD.',
    subtitle: 'Uncompromising engineering, factory-tested reliability, and precision components for track and street performance.',
    image: '/media/barni1-automobile-679874_1920.jpg',
    video: '/media/141581-777930475_medium.mp4',
    buttonText: 'Shop Parts Store',
    buttonLink: '/store',
    active: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'PROFESSIONAL GARAGE & MASTER DIAGNOSTICS',
    subtitle: 'State-of-the-art 3D laser alignment, ECU tuning, and certified ASE master technicians at your service.',
    image: '/media/dayronv-nissan-885309_1920.jpg',
    video: '/media/177443-857376870_medium.mp4',
    buttonText: 'Book Service Now',
    buttonLink: '/services',
    active: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'UP TO 30% OFF PERFORMANCE BRAKES & SUSPENSION',
    subtitle: 'Upgrade your stopping power and cornering dynamics with world-class Brembo, KW, and EBC components.',
    image: '/media/gahsh-cars-975634_1920.jpg',
    video: '/media/31139-384523221_medium.mp4',
    buttonText: 'Explore Exclusive Deals',
    buttonLink: '/store?featured=true',
    active: true,
    order: 3,
  },
];

const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const activeSlides = slides && slides.length > 0 ? slides : fallbackSlides;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const slide = activeSlides[currentSlide];

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-black flex items-center">
      {/* Background Media Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id || currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full"
        >
          {slide.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster={slide.image}
              className="w-full h-full object-cover opacity-60"
            >
              <source src={slide.video} type="video/mp4" />
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </video>
          ) : (
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
          )}

          {/* Dark Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-brand-red uppercase shadow-redGlow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Apex Motors Performance Hub</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1] uppercase drop-shadow-lg"
          >
            {slide.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal"
          >
            {slide.subtitle}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <Link
              to={slide.buttonLink || '/store'}
              className="btn-primary px-8 py-4 text-sm font-bold uppercase tracking-wider flex items-center gap-3 shadow-redGlow group"
            >
              <span>{slide.buttonText || 'Shop Parts'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/services"
              className="btn-secondary px-6 py-4 text-sm font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Wrench className="w-4 h-4 text-brand-red" />
              <span>Book Garage Service</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Manual Controls */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all shadow-lg backdrop-blur-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all shadow-lg backdrop-blur-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-10 bg-brand-red shadow-redGlow' : 'w-2.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
