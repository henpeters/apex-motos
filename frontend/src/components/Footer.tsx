import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, Clock, ShieldCheck, Truck, Headphones, Award, Send } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090E] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-red/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Feature Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Genuine Parts</h4>
              <p className="text-xs text-slate-400">100% Factory & OEM Certified</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Rapid Dispatch</h4>
              <p className="text-xs text-slate-400">Same-Day Express Shipping</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">ASE Certified</h4>
              <p className="text-xs text-slate-400">Master Garage Technicians</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6 text-brand-red" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Expert Support</h4>
              <p className="text-xs text-slate-400">Live Fitment Consultation</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <span className="font-heading font-black text-2xl tracking-wider text-white">
                APEX <span className="text-brand-red">MOTORS</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your premier destination for high-performance automotive parts, precision racing components, and master garage diagnostic services. Built for drivers who demand excellence.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="font-heading text-xs uppercase tracking-widest text-slate-300 font-bold mb-2">
                Subscribe for Exclusive Deals & Parts Releases
              </h5>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red flex-1"
                />
                <button type="submit" className="btn-primary px-4 py-2.5 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-brand-red transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/store" className="hover:text-brand-red transition-colors">Auto Parts Store</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-red transition-colors">Garage Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-red transition-colors">About Our Garage</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-red transition-colors">Contact Technicians</Link>
              </li>
            </ul>
          </div>

          {/* Featured Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/store?category=brake-systems" className="hover:text-brand-red transition-colors">Brake Systems</Link>
              </li>
              <li>
                <Link to="/store?category=engine-parts" className="hover:text-brand-red transition-colors">Engine Components</Link>
              </li>
              <li>
                <Link to="/store?category=suspension-steering" className="hover:text-brand-red transition-colors">Suspension & Struts</Link>
              </li>
              <li>
                <Link to="/store?category=transmission-drivetrain" className="hover:text-brand-red transition-colors">Clutch & Transmission</Link>
              </li>
              <li>
                <Link to="/store?category=performance-upgrades" className="hover:text-brand-red transition-colors">Turbos & Intakes</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide uppercase">
              Garage Headquarters
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                <span>100 Performance Way, Motor City, MI 48201</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-red shrink-0" />
                <span>+1 (800) 555-APEX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-red shrink-0" />
                <span>service@apexmotors.com</span>
              </li>
              <li className="flex items-start gap-3 pt-1">
                <Clock className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Mon - Fri: 8:00 AM - 7:00 PM<br />Sat: 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Apex Motors Inc. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Render Deployment Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
