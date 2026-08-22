import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { getProducts, getMediaUrl } from '../services/api';
import { Product } from '../types';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getProducts({ search: query, limit: 6 });
        setResults(data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slugOrId: string) => {
    onClose();
    navigate(`/store/product/${slugOrId}`);
  };

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/store?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-start justify-center pt-20 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0F141F] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Header */}
        <form onSubmit={handleFullSearch} className="relative p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-red shrink-0 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by part name, SKU, brand (e.g. Brembo brake pads)..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-base focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-slate-400 animate-spin shrink-0" />}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {query.trim() && !loading && results.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No auto parts found matching "{query}"</p>
              <span className="text-xs text-slate-500 mt-1 block">Try searching for SKU, Brand (Bosch, Brembo) or Category</span>
            </div>
          )}

          {results.map((product) => (
            <div
              key={product._id}
              onClick={() => handleSelectProduct(product.slug || product._id)}
              className="glass-panel p-3 rounded-xl flex items-center gap-4 border border-white/10 hover:border-brand-red/40 cursor-pointer transition-all group"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img
                  src={getMediaUrl(product.images?.[0] || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg')}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-bold text-brand-red uppercase">{product.brand}</span>
                  <span>•</span>
                  <span className="font-mono">SKU: {product.sku}</span>
                </div>
                <h5 className="font-heading font-bold text-white text-sm truncate group-hover:text-brand-red transition-colors">
                  {product.name}
                </h5>
              </div>

              <div className="text-right shrink-0">
                <span className="font-heading font-bold text-white text-base">
                  ${(product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price).toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 block flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3 h-3" /> In Stock
                </span>
              </div>
            </div>
          ))}

          {results.length > 0 && (
            <button
              onClick={handleFullSearch}
              className="w-full py-3 text-xs uppercase font-bold tracking-wider text-brand-red hover:text-white bg-brand-red/10 hover:bg-brand-red border border-brand-red/30 rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>See All Matching Parts ({results.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
