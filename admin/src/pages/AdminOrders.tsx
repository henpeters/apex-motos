import React, { useState, useEffect } from 'react';
import { Search, Eye, ShoppingBag, X, CheckCircle, Clock, Truck } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../services/api';
import { Order } from '../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders({ search, status: statusFilter });
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const updated = await updateOrderStatus(orderId, { orderStatus: newStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          Order <span className="text-brand-red">Management</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Monitor customer order fulfillment, update status, and inspect shipping information.</p>
      </div>

      {/* Filter Bar */}
      <div className="admin-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name, email..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-red"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all shrink-0 ${
                statusFilter === st ? 'bg-brand-red text-white shadow-redGlow' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 uppercase text-[11px] font-bold text-slate-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Order Code</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-red">
                      {ord.orderNumber}
                      <span className="text-[10px] text-slate-500 block font-sans">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{ord.customerInfo?.fullName}</span>
                      <span className="text-slate-400">{ord.customerInfo?.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-red cursor-pointer font-semibold"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-red text-slate-300 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-[#0F141F] border border-white/15 rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono block">Order Details</span>
                <h3 className="font-heading font-bold text-xl text-white font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Customer & Address Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-2xl border border-white/5">
              <div>
                <span className="text-slate-500 uppercase font-bold block mb-1">Customer Information</span>
                <span className="font-bold text-white block">{selectedOrder.customerInfo?.fullName}</span>
                <span className="text-slate-300 block">{selectedOrder.customerInfo?.email}</span>
                <span className="text-slate-300 block">{selectedOrder.customerInfo?.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-bold block mb-1">Shipping Address</span>
                <span className="text-slate-300 block">{selectedOrder.customerInfo?.address}</span>
                <span className="text-slate-300 block">
                  {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.country} {selectedOrder.customerInfo?.zipCode}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-heading font-bold text-xs uppercase text-slate-400 mb-2">Purchased Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image || '/media/schwarzenarzisse-auto-parts-white-365353_1920.jpg'} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-slate-950 p-1" />
                      <div>
                        <span className="font-bold text-white block">{item.name}</span>
                        <span className="text-slate-500 font-mono">SKU: {item.sku} × {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="pt-4 border-t border-white/10 space-y-1.5 text-xs text-right">
              <div className="text-slate-400">Subtotal: <strong className="text-white font-mono">${selectedOrder.subtotal.toFixed(2)}</strong></div>
              <div className="text-slate-400">Shipping: <strong className="text-white font-mono">${selectedOrder.shippingFee.toFixed(2)}</strong></div>
              <div className="text-slate-400">Tax: <strong className="text-white font-mono">${selectedOrder.tax.toFixed(2)}</strong></div>
              <div className="text-base font-bold text-white pt-2">
                Total Paid: <span className="font-mono text-brand-red text-xl">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
