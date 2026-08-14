import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getMediaUrl } from '../services/api';

const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    tax,
    total,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0F141F] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-brand-red" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white">Your Shopping Cart</h3>
                <p className="text-xs text-slate-400 font-mono">{itemCount} Parts Selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-slate-900/80 px-6 py-3 border-b border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-3.5 h-3.5 text-brand-red" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400 font-bold">Free Express Delivery Unlocked!</span>
                ) : (
                  <span>Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping</span>
                )}
              </span>
              <span className="font-mono font-bold text-slate-400">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-red to-emerald-400 h-full transition-all duration-300 shadow-redGlow"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Browse our catalog of performance brake systems, engine parts, and suspension kits.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/store');
                  }}
                  className="btn-primary px-6 py-2.5 text-xs uppercase font-bold tracking-wider"
                >
                  Explore Auto Parts Store
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice =
                  item.product.discountPrice && item.product.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product.price;
                const image = getMediaUrl(item.product.images?.[0] || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg');

                return (
                  <div
                    key={item.product._id}
                    className="glass-panel p-4 rounded-xl flex items-center gap-4 border border-white/10"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-950 flex items-center justify-center p-2 shrink-0 border border-white/5">
                      <img src={image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-heading font-bold text-white text-sm truncate">{item.product.name}</h5>
                      <span className="text-[10px] font-mono text-slate-400 block">SKU: {item.product.sku}</span>
                      <span className="font-bold text-brand-red text-sm mt-0.5 block">${itemPrice.toFixed(2)}</span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-slate-900 border border-white/10 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-slate-900/60 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-semibold text-white">
                    {shippingFee === 0 ? <span className="text-emerald-400 uppercase font-bold text-xs">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (7%)</span>
                  <span className="font-mono font-semibold text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-xl text-brand-red">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted & Stripe Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
