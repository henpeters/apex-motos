import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { getStats } from '../services/api';
import { DashboardStats } from '../types';

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="admin-card h-32 rounded-2xl" />
          ))}
        </div>
        <div className="admin-card h-80 rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
          Executive <span className="text-brand-red">Dashboard</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">Real-time store metrics, inventory alerts, and revenue trends.</p>
      </div>

      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Revenue</span>
            <span className="font-heading font-black text-2xl sm:text-3xl text-white font-mono mt-1 block">
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Orders</span>
            <span className="font-heading font-black text-2xl sm:text-3xl text-white font-mono mt-1 block">
              {stats.totalOrders}
            </span>
            <span className="text-[11px] text-brand-red font-semibold mt-1 block">
              {stats.pendingOrders} Pending Action
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Products</span>
            <span className="font-heading font-black text-2xl sm:text-3xl text-white font-mono mt-1 block">
              {stats.totalProducts}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold mt-1 block">
              {stats.lowStockProducts?.length || 0} Low Stock Items
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Inquiries / Msgs</span>
            <span className="font-heading font-black text-2xl sm:text-3xl text-white font-mono mt-1 block">
              {stats.totalMessages}
            </span>
            <span className="text-[11px] text-indigo-400 font-semibold mt-1 block">
              {stats.unreadMessages} Unread Messages
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. REVENUE & ORDERS VISUAL CHART */}
      <div className="admin-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
              Monthly Revenue Performance ($)
            </h3>
            <p className="text-xs text-slate-400">Sales breakdown over the previous 6 months</p>
          </div>
          <span className="text-xs font-mono font-bold text-brand-red bg-brand-red/10 border border-brand-red/20 px-3 py-1 rounded-lg">
            Analytics Engine
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end gap-4 sm:gap-8 pt-8 px-4 border-b border-white/10 pb-4">
          {stats.monthlySales?.map((data, idx) => {
            const maxRev = 45000;
            const heightPercent = Math.min(100, Math.max(15, (data.revenue / maxRev) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-brand-red font-bold">
                  ${data.revenue.toLocaleString()}
                </div>
                <div
                  className="w-full max-w-[48px] bg-gradient-to-t from-brand-red/40 to-brand-red rounded-t-xl group-hover:brightness-125 transition-all shadow-redGlow"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-bold text-slate-400 font-mono">{data.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. RECENT ORDERS & LOW STOCK ALERTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="admin-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-tight">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentOrders?.map((ord) => (
              <div key={ord._id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-brand-red block">{ord.orderNumber}</span>
                  <span className="text-slate-300 block font-semibold">{ord.customerInfo?.fullName}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white block">${ord.total.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    ord.orderStatus === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="admin-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading font-bold text-base text-white uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Inventory Alerts</span>
            </h3>
            <Link to="/admin/products" className="text-xs font-bold text-brand-red hover:underline flex items-center gap-1">
              Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.lowStockProducts?.map((prod) => (
              <div key={prod._id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block truncate max-w-[200px]">{prod.name}</span>
                  <span className="text-slate-500 font-mono">SKU: {prod.sku}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-amber-400 block">{prod.stock} Units Left</span>
                  <span className="text-[10px] text-slate-400 block">${prod.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
