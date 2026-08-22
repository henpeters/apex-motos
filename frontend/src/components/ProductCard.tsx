import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { getMediaUrl } from '../services/api';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const activePrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const mainImage = product.images && product.images.length > 0
    ? getMediaUrl(product.images[0])
    : getMediaUrl('/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg');

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group relative border border-white/10">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 bg-brand-red text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-redGlow">
          -{discountPercent}% OFF
        </span>
      )}

      {/* Stock Status Badge */}
      <span className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1">
        <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
      </span>

      {/* Image Gallery Container */}
      <div className="relative w-full h-56 bg-slate-900/40 overflow-hidden flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/store/product/${product.slug || product._id}`}
            className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 text-white flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all shadow-lg"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-redGlow disabled:opacity-50"
            title="Add to Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold text-brand-red uppercase tracking-wider">{product.brand}</span>
            <span className="text-[11px] font-mono text-slate-500">SKU: {product.sku}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/store/product/${product.slug || product._id}`}
            className="font-heading font-bold text-slate-100 text-base line-clamp-2 hover:text-brand-red transition-colors leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Rating & Compatibility */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-bold text-white text-xs">{product.rating || 4.8}</span>
              <span className="text-slate-500">({product.numReviews || 12})</span>
            </div>

            {product.compatibility && product.compatibility.length > 0 && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Fit Verified
              </span>
            )}
          </div>

          {/* Pricing & Add to Cart Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-xl text-white">
                  ${activePrice?.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="btn-primary px-3.5 py-2 text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 shadow-redGlow disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
