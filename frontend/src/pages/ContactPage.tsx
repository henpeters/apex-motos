import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Headphones, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { sendContactMessage } from '../services/api';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Parts Fitment Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Save message in Backend Database for Admin Dashboard
      await sendContactMessage({ name, email, phone, subject, message });

      // 2. Direct Browser FormSubmit.co notification to henryperson11@gmail.com
      fetch('https://formsubmit.co/ajax/henryperson11@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Apex Motors Contact Inquiry: ${subject}`,
          Customer_Name: name,
          Customer_Email: email,
          Customer_Phone: phone || 'Not provided',
          Subject: subject,
          Message: message,
          _template: 'table',
          _captcha: 'false',
        }),
      }).catch((err) => console.error('Browser FormSubmit warning:', err));

      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to submit contact inquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <SEO
        title="Contact Technical Support — Apex Motors"
        description="Get technical consultation on auto parts fitment, custom vehicle builds, or garage service appointments. Reach out to our master technicians."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest bg-brand-red/10 border border-brand-red/30 px-3.5 py-1.5 rounded-full">
            <Headphones className="w-4 h-4" />
            <span>24/7 Garage Consultation</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight">
            Contact <span className="text-gradient-red">Apex Motors</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Have questions regarding part fitment, diagnostic booking, or custom performance upgrades? Reach out to our master technical advisors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Contact Form Panel */}
          <div className="lg:col-span-2 glass-panel p-8 sm:p-10 rounded-3xl border border-white/10">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white">Inquiry Received & Emailed!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. A senior parts specialist will review your inquiry and respond within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-heading font-bold text-xl text-white uppercase tracking-tight">
                  Send Technical Inquiry
                </h3>

                {errorMsg && (
                  <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Marcus Vance"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red cursor-pointer"
                    >
                      <option>Parts Fitment Inquiry</option>
                      <option>Garage Service Appointment</option>
                      <option>Order Shipping Status</option>
                      <option>Wholesale & Bulk Orders</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Your Message / Vehicle Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your vehicle year/make/model and part inquiry..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Info Cards */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h4 className="font-heading font-bold text-lg text-white uppercase tracking-tight border-b border-white/10 pb-3">
                Garage Contact Info
              </h4>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-white block">Apex Garage Headquarters</span>
                    <span className="text-xs text-slate-400">100 Performance Way, Motor City, MI 48201</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Direct Hotline</span>
                    <span className="text-xs text-slate-400 font-mono">+1 (800) 555-APEX</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Email Support</span>
                    <span className="text-xs text-slate-400">henryperson11@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                  <Clock className="w-5 h-5 text-brand-red shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-white block">Workshop Hours</span>
                    <span className="text-xs text-slate-400">
                      Mon - Fri: 8:00 AM - 7:00 PM EST<br />
                      Saturday: 9:00 AM - 5:00 PM EST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Styled Map Placeholder */}
            <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2">Location Map</span>
              <div className="w-full h-44 rounded-2xl bg-slate-950 overflow-hidden relative border border-white/10">
                <iframe
                  title="Apex Motors Location Map"
                  src="https://maps.google.com/maps?q=Detroit,MI&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-75"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
