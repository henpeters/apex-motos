import React, { useState } from 'react';
import { X, Calendar, Clock, Wrench, CheckCircle, ShieldCheck } from 'lucide-react';
import { Service } from '../types';

interface BookingModalProps {
  service?: Service | null;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0F141F] border border-white/15 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Book Master Garage Service</h3>
              <p className="text-xs text-slate-400">ASE Certified Technicians</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="font-heading font-bold text-xl text-white">Garage Appointment Requested!</h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Thank you, <span className="font-bold text-white">{fullName}</span>. Our master service advisor will call you at <span className="font-mono text-brand-red">{phone}</span> to confirm your appointment for {preferredDate} at {preferredTime}.
            </p>
            <button
              onClick={onClose}
              className="btn-primary px-6 py-3 text-xs uppercase font-bold tracking-wider mt-4"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Service Summary Banner */}
            {service && (
              <div className="bg-brand-red/10 border border-brand-red/30 p-3.5 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Selected Service</span>
                  <span className="font-heading font-bold text-white text-sm">{service.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-brand-red text-base">${service.price.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-400 block">{service.duration}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Vehicle (Year, Make, Model) *
                </label>
                <input
                  type="text"
                  required
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="2019 BMW M3 F80"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-red" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                >
                  <option>08:30 AM</option>
                  <option>10:00 AM</option>
                  <option>01:00 PM</option>
                  <option>03:30 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <button
                type="submit"
                className="btn-primary w-full py-3.5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Service Appointment</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
