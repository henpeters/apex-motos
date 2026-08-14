import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Search, RotateCcw } from 'lucide-react';
import { useFitment } from '../context/FitmentContext';

const MAKES = ['BMW', 'Toyota', 'Honda', 'Nissan', 'Porsche', 'Ford', 'Subaru', 'Audi', 'Volkswagen', 'Chevrolet', 'Lexus', 'Mercedes-Benz', 'Subaru', 'Acura', 'Universal'];

const MODELS_BY_MAKE: Record<string, string[]> = {
  BMW: ['M3 / M4 (F80 / F82)', 'M2 Competition (F87)', '335i / M235i (N55)', '340i / M240i (B58)', 'M3 (E46 / E92)'],
  Toyota: ['Camry', 'RAV4', 'Tacoma 4WD', '86 / GR86', 'GR Supra (A90)', 'Supra (JZA80 2JZ)'],
  Honda: ['Civic Type R (FK8)', 'Civic Si (1.5T)', 'Civic / Accord / CR-V'],
  Nissan: ['370Z (Z34)', 'GT-R (R35)'],
  Porsche: ['911 Carrera (991)', 'Cayman S (987)'],
  Ford: ['Mustang GT (5.0L)', 'Mustang GT (MT-82)', 'F-150 4WD', 'Expedition'],
  Subaru: ['Impreza WRX STI (EJ257)', 'WRX STI', 'BRZ'],
  Audi: ['S3 / TTS (2.0 TSI)'],
  Volkswagen: ['Golf R Mk7'],
  Chevrolet: ['Corvette (6.2L)', 'Camaro SS (TR-6060)'],
  Lexus: ['ES350'],
  'Mercedes-Benz': ['C63 AMG (W204)', 'E550'],
  Acura: ['Integra A-Spec', 'MDX / RDX / TLX'],
  Universal: ['All Makes & Models'],
};

const YEARS = Array.from({ length: 30 }, (_, i) => String(2025 - i));

const FitmentBar: React.FC = () => {
  const { fitment, setFitment, clearFitment } = useFitment();
  const [make, setMake] = useState(fitment.make || '');
  const [model, setModel] = useState(fitment.model || '');
  const [year, setYear] = useState(fitment.year || '');
  const navigate = useNavigate();

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMake(val);
    setModel('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (make && model && year) {
      setFitment({ make, model, year });
      navigate(`/store?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${year}`);
    }
  };

  const handleReset = () => {
    setMake('');
    setModel('');
    setYear('');
    clearFitment();
  };

  return (
    <div className="w-full bg-[#111622] border-y border-white/10 py-6 px-4 relative z-30 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-4">
          {/* Header Tag */}
          <div className="flex items-center gap-3 shrink-0 text-white font-heading font-bold text-sm uppercase tracking-wider">
            <div className="w-9 h-9 rounded-lg bg-brand-red/20 border border-brand-red/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-red" />
            </div>
            <div>
              <span className="block text-white font-extrabold text-base leading-none">GARAGE FITMENT FINDER</span>
              <span className="text-[11px] text-slate-400 font-normal capitalize">Guarantee 100% Part Compatibility</span>
            </div>
          </div>

          {/* Dropdown Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
            {/* Year Selector */}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-slate-900/80 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
            >
              <option value="">1. Select Vehicle Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white">
                  {y}
                </option>
              ))}
            </select>

            {/* Make Selector */}
            <select
              value={make}
              onChange={handleMakeChange}
              className="bg-slate-900/80 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red transition-all cursor-pointer"
            >
              <option value="">2. Select Vehicle Make</option>
              {MAKES.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white">
                  {m}
                </option>
              ))}
            </select>

            {/* Model Selector */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
              className="bg-slate-900/80 border border-white/15 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-red transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="">3. Select Vehicle Model</option>
              {make &&
                MODELS_BY_MAKE[make]?.map((mod) => (
                  <option key={mod} value={mod} className="bg-slate-900 text-white">
                    {mod}
                  </option>
                ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
            <button
              type="submit"
              disabled={!make || !model || !year}
              className="btn-primary flex-1 lg:flex-none px-6 py-3 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-redGlow"
            >
              <Search className="w-4 h-4" />
              <span>Find Compatible Parts</span>
            </button>

            {(make || model || year || fitment.make) && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary px-3 py-3 text-xs flex items-center justify-center text-slate-400 hover:text-white"
                title="Reset Vehicle Selector"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FitmentBar;
