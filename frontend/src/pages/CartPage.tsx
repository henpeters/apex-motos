import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getMediaUrl } from '../services/api';

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    tax,
    total,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/store" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 text-brand-red" />
          <span>Continue Shopping for Auto Parts</span>
        </Link>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mb-8">
          Shopping <span className="text-gradient-red">Cart ({itemCount})</span>
        </h1>

        {cart.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-white/10 space-y-4 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-white">Your Shopping Cart is Empty</h3>
            <p className="text-sm text-slate-400">Explore our catalog of performance brake systems, engine components, and suspension kits.</p>
            <Link to="/store" className="btn-primary inline-flex px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-redGlow">
              Browse Parts Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-heading font-bold text-xs uppercase text-slate-400">Selected Parts</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {cart.map((item) => {
                const itemPrice =
                  item.product.discountPrice && item.product.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product.price;
                const image = getMediaUrl(item.product.images?.[0] || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg');

                return (
                  <div key={item.product._id} className="glass-panel p-4 sm:p-6 rounded-2xl flex items-center gap-6 border border-white/10">
                    <div className="w-20 h-20 rounded-xl bg-slate-950 p-2 flex items-center justify-center shrink-0">
                      <img src={image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-brand-red uppercase">{item.product.brand}</span>
                      <h4 className="font-heading font-bold text-white text-base truncate">{item.product.name}</h4>
                      <span className="text-xs font-mono text-slate-500 block">SKU: {item.product.sku}</span>
                      <span className="font-bold text-white text-lg mt-1 block">${itemPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2 bg-slate-900 border border-white/15 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-white text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Summary Panel */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 h-fit space-y-6">
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-tight border-b border-white/10 pb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-bold text-white">
                    {shippingFee === 0 ? <span className="text-emerald-400 font-bold uppercase text-xs">FREE</span> : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Estimated Tax (7%)</span>
                  <span className="font-mono font-bold text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between text-lg font-bold text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-2xl text-brand-red">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted SSL & Stripe Payment Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
