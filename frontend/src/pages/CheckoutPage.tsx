import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Order } from '../types';

const CheckoutPage: React.FC = () => {
  const { cart, subtotal, shippingFee, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [zipCode, setZipCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card (Stripe Ready)');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-32 px-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <Link to="/store" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase">
          Return to Store
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacingOrder(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        sku: item.product.sku,
        image: item.product.images?.[0] || '',
        price: item.product.discountPrice && item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price,
        quantity: item.quantity,
      }));

      // 1. Create order in Backend REST API
      const newOrder = await createOrder({
        customerInfo: {
          fullName,
          email,
          phone,
          address,
          city,
          country,
          zipCode,
          deliveryInstructions,
        },
        items: orderItems,
        subtotal,
        shippingFee,
        tax,
        total,
        paymentMethod,
      });

      const itemsSummaryText = cart
        .map((item) => `${item.product.name} (SKU: ${item.product.sku}) x ${item.quantity} - $${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}`)
        .join('\n');

      // 2. Direct browser FormSubmit call to Shop Admin (henryperson11@gmail.com)
      fetch('https://formsubmit.co/ajax/henryperson11@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `🚨 NEW ORDER RECEIVED: ${newOrder.orderNumber} ($${total.toFixed(2)})`,
          Order_Number: newOrder.orderNumber,
          Customer_Name: fullName,
          Customer_Email: email,
          Customer_Phone: phone,
          Shipping_Address: `${address}, ${city}, ${country} ${zipCode}`,
          Order_Items: itemsSummaryText,
          Subtotal: `$${subtotal.toFixed(2)}`,
          Shipping_Fee: `$${shippingFee.toFixed(2)}`,
          Tax: `$${tax.toFixed(2)}`,
          Total_Amount: `$${total.toFixed(2)}`,
          Payment_Method: paymentMethod,
          Delivery_Instructions: deliveryInstructions || 'None',
          _template: 'table',
          _captcha: 'false',
        }),
      }).catch((err) => console.error('Shop email error:', err));

      // 3. Direct browser FormSubmit call to Client/Customer (email)
      if (email) {
        fetch(`https://formsubmit.co/ajax/${email}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: `✅ Apex Motors Order Confirmation — Order #${newOrder.orderNumber}`,
            Greeting: `Hello ${fullName}, thank you for your order at Apex Motors!`,
            Order_Number: newOrder.orderNumber,
            Order_Items: itemsSummaryText,
            Total_Paid: `$${total.toFixed(2)}`,
            Shipping_Address: `${address}, ${city}, ${country}`,
            Customer_Support: 'henryperson11@gmail.com | +1 (800) 555-APEX',
            _template: 'table',
            _captcha: 'false',
          }),
        }).catch((err) => console.error('Client email error:', err));
      }

      setCompletedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="inline-block bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-redGlow">
            Order Confirmed & Email Sent
          </span>

          <h1 className="font-heading font-black text-3xl text-white uppercase tracking-tight">
            Thank You For Your Order!
          </h1>

          <div className="bg-slate-900/80 p-4 rounded-xl text-xs font-mono space-y-1">
            <span className="text-slate-400 block">ORDER CONFIRMATION CODE</span>
            <span className="text-brand-red text-xl font-bold">{completedOrder.orderNumber}</span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
            We have dispatched your order details to <span className="font-bold text-white">{completedOrder.customerInfo.email}</span>. A copy of the order has also been sent to shop management at <span className="font-mono text-brand-red">henryperson11@gmail.com</span>.
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/store" className="btn-primary px-8 py-3.5 text-xs font-bold uppercase tracking-wider">
              Continue Shopping Parts
            </Link>
            <Link to="/" className="btn-secondary px-6 py-3.5 text-xs font-bold uppercase tracking-wider">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 text-brand-red" />
          <span>Back to Shopping Cart</span>
        </Link>

        <h1 className="font-heading font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mb-8">
          Express <span className="text-gradient-red">Checkout</span>
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Form Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Details */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-red text-white flex items-center justify-center text-xs">1</span>
                <span>Customer & Delivery Address</span>
              </h3>

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
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Performance Ave"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Detroit"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="48201"
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Delivery Notes / Gate Code
                </label>
                <textarea
                  rows={2}
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Optional instructions for delivery driver..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-brand-red text-white flex items-center justify-center text-xs">2</span>
                <span>Payment Options (Stripe Ready)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setPaymentMethod('Credit Card (Stripe Ready)')}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === 'Credit Card (Stripe Ready)'
                      ? 'bg-brand-red/10 border-brand-red text-white ring-2 ring-brand-red/30'
                      : 'bg-slate-900/60 border-white/10 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm block">Credit / Debit Card</span>
                    <span className="text-[11px] text-slate-400">Visa, Mastercard, AMEX</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('Cash / Payment on Garage Pickup')}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                    paymentMethod === 'Cash / Payment on Garage Pickup'
                      ? 'bg-brand-red/10 border-brand-red text-white ring-2 ring-brand-red/30'
                      : 'bg-slate-900/60 border-white/10 text-slate-400'
                  }`}
                >
                  <Truck className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <span className="font-bold text-white text-sm block">Garage Pickup Payment</span>
                    <span className="text-[11px] text-slate-400">Pay at counter upon pickup</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Order Summary Column */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 h-fit space-y-6">
            <h3 className="font-heading font-bold text-xl text-white uppercase tracking-tight border-b border-white/10 pb-4">
              Items Summary ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => {
                const itemPrice =
                  item.product.discountPrice && item.product.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product.price;
                return (
                  <div key={item.product._id} className="flex items-center justify-between text-xs">
                    <div className="truncate max-w-[180px]">
                      <span className="font-bold text-white block truncate">{item.product.name}</span>
                      <span className="text-slate-500 font-mono">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-200">${(itemPrice * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span className="font-mono font-bold text-white">
                  {shippingFee === 0 ? <span className="text-emerald-400 font-bold uppercase text-xs">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Estimated Tax (7%)</span>
                <span className="font-mono font-bold text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="font-mono text-2xl text-brand-red">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50"
            >
              <span>{placingOrder ? 'Processing Order...' : 'Place Order Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Email Confirmation Sent</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
