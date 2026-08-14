import React, { useState, useEffect } from 'react';
import { Wrench, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { getServices, getMediaUrl } from '../services/api';
import { Service } from '../types';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (serv: Service) => {
    setSelectedService(serv);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest bg-brand-red/10 border border-brand-red/30 px-3.5 py-1.5 rounded-full">
            <Wrench className="w-4 h-4" />
            <span>Master Garage & Diagnostics</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Garage Services <span className="text-gradient-red">& Repairs</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From precision Hunter 3D laser wheel alignments to master ECU diagnostics and brake overhaul services, our ASE Certified technicians deliver perfection.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel h-96 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((serv) => (
              <div
                key={serv._id}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-6 group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="w-full h-48 rounded-2xl bg-slate-950 overflow-hidden relative">
                    <img
                      src={getMediaUrl(serv.image || '/media/life-of-pix-cylinders-569151_1920.jpg')}
                      alt={serv.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white text-xs font-mono font-bold px-3 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-red" />
                      {serv.duration}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-brand-red transition-colors">
                    {serv.name}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {serv.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>ASE Master Certified Technicians</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full Digital Inspection Report</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Starting Price</span>
                    <span className="font-heading font-black text-2xl text-white">
                      ${serv.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBook(serv)}
                    className="btn-primary px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-redGlow"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookingOpen && (
        <BookingModal
          service={selectedService}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  );
};

export default ServicesPage;
