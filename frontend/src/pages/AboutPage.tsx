import React from 'react';
import { ShieldCheck, Award, Wrench, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-16 mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
          <img
            src="/media/gahsh-cars-975634_1920.jpg"
            alt="About Apex Motors"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          <div className="relative z-20 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-redGlow">
              <Award className="w-4 h-4" />
              <span>Established 2016</span>
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-6xl text-white uppercase tracking-tight leading-tight">
              Driven by <span className="text-gradient-red">Performance</span> & Precision
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Apex Motors was founded with a singular mission: to supply automotive enthusiasts, race teams, and daily drivers with factory-certified OEM auto parts and master diagnostic garage services.
            </p>
          </div>
        </div>

        {/* Dynamic Statistics Counters Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="font-heading font-black text-3xl sm:text-5xl text-brand-red font-mono">10+</span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Years Industry Experience</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="font-heading font-black text-3xl sm:text-5xl text-brand-red font-mono">5,000+</span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Satisfied Drivers</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="font-heading font-black text-3xl sm:text-5xl text-brand-red font-mono">10,000+</span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Parts Sold Worldwide</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-1">
            <span className="font-heading font-black text-3xl sm:text-5xl text-brand-red font-mono">99.8%</span>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Fitment Accuracy Rate</span>
          </div>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-tight">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To eliminate fitment guesswork in auto parts purchasing by delivering 100% verified OEM components, ultra-fast dispatch, and uncompromising garage repair standards.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center text-brand-red">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white uppercase tracking-tight">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To remain North America's premier high-performance automotive hub, connecting track-tested engineering with seamless digital e-commerce and master garage diagnostics.
            </p>
          </div>
        </div>

        {/* Team Showcase */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
              <Users className="w-4 h-4" />
              <span>Master Technicians</span>
            </div>
            <h2 className="font-heading font-black text-3xl text-white uppercase tracking-tight">
              Meet Our <span className="text-gradient-red">Garage Leadership</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand-red overflow-hidden mx-auto">
                <img src="/media/dayronv-nissan-885309_1920.jpg" alt="Marcus Vance" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-lg">Marcus Vance</h4>
                <span className="text-xs text-brand-red font-bold uppercase block">Lead Diagnostic Director</span>
                <span className="text-[11px] text-slate-400 block mt-1">ASE L1 Advanced Specialist</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand-red overflow-hidden mx-auto">
                <img src="/media/barni1-automobile-679874_1920.jpg" alt="Sarah Jenkins" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-lg">Sarah Jenkins</h4>
                <span className="text-xs text-brand-red font-bold uppercase block">Chief Tuning Engineer</span>
                <span className="text-[11px] text-slate-400 block mt-1">12+ Years Track Tuning</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-brand-red overflow-hidden mx-auto">
                <img src="/media/schwarzenarzisse-antique-car-365354_1920.jpg" alt="David Miller" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-lg">David Miller</h4>
                <span className="text-xs text-brand-red font-bold uppercase block">Head Parts Specialist</span>
                <span className="text-[11px] text-slate-400 block mt-1">Brake & Suspension Lead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
