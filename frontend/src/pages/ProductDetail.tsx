import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck, Plus, Minus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { getProductById, getMediaUrl } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'compatibility' | 'description'>('specs');

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((data) => {
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        if (data.product.images && data.product.images.length > 0) {
          setActiveImage(data.product.images[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-32 px-4 flex items-center justify-center">
        <div className="glass-panel p-12 rounded-3xl animate-pulse w-full max-w-4xl h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-32 px-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <Link to="/store" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
          Return to Store
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <SEO
        title={`${product.name} — ${product.brand}`}
        description={product.description}
        image={getMediaUrl(product.images?.[0])}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/store" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 text-brand-red" />
          <span>Back to Auto Parts Store</span>
        </Link>

        {/* MAIN PRODUCT DETAIL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT: GALLERY PREVIEW */}
          <div className="space-y-4">
            <div className="w-full h-[450px] rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <img
                src={getMediaUrl(activeImage || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg')}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-brand-red text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-redGlow z-10">
                  SALE
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border transition-all shrink-0 ${
                      activeImage === img ? 'border-brand-red ring-2 ring-brand-red/30' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getMediaUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-bold text-brand-red uppercase tracking-widest">{product.brand}</span>
                <span className="font-mono text-slate-500">SKU: {product.sku}</span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating & Review */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-amber-400' : 'text-slate-600'}`}
                    />
                  ))}
                  <span className="font-bold text-white text-sm ml-1">{product.rating || 4.8}</span>
                </div>
                <span className="text-slate-500 text-xs font-medium">({product.numReviews || 12} Verified Customer Reviews)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-white">
                    ${activePrice?.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-slate-500 line-through font-mono">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 block mt-1">Includes all taxes & factory warranty</span>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                  product.stock > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-slate-300 text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Quantity:</span>
                <div className="flex items-center gap-3 bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-white text-base w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="btn-primary py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="btn-secondary py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Buy Now (Express)</span>
                </button>
              </div>
            </div>

            {/* Feature Bullet Perks */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-red" />
                <span>100% Genuine OEM Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-red" />
                <span>Same-Day Express Dispatch</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS: SPECIFICATIONS & VEHICLE COMPATIBILITY */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 mb-16">
          <div className="flex border-b border-white/10 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'specs' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Technical Specifications
              {activeTab === 'specs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red shadow-redGlow" />}
            </button>

            <button
              onClick={() => setActiveTab('compatibility')}
              className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'compatibility' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vehicle Fitment Table ({product.compatibility?.length || 0})
              {activeTab === 'compatibility' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red shadow-redGlow" />}
            </button>
          </div>

          {/* TAB 1: SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-2 px-4 rounded-xl bg-slate-900/60 border border-white/5 text-sm">
                    <span className="text-slate-400 font-medium">{spec.key}</span>
                    <span className="font-bold text-white font-mono">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">Standard OEM factory specifications apply.</p>
              )}
            </div>
          )}

          {/* TAB 2: COMPATIBILITY TABLE */}
          {activeTab === 'compatibility' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Make</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Year Range</th>
                    <th className="py-3 px-4">Fitment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {product.compatibility && product.compatibility.length > 0 ? (
                    product.compatibility.map((comp, idx) => (
                      <tr key={idx} className="hover:bg-white/5">
                        <td className="py-3 px-4 font-bold text-white">{comp.make}</td>
                        <td className="py-3 px-4">{comp.model}</td>
                        <td className="py-3 px-4 font-mono">{comp.yearStart} - {comp.yearEnd}</td>
                        <td className="py-3 px-4 text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> 100% Direct Bolt-On
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-slate-400">
                        Universal vehicle fitment. Fits most standard performance configurations.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tight">
              Related <span className="text-gradient-red">Performance Parts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
