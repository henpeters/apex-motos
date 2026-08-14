import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Wrench,
  Image as ImageIcon,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Hero Slides', path: '/admin/hero-slides', icon: ImageIcon },
    { name: 'Testimonials', path: '/admin/testimonials', icon: Star },
    { name: 'Customer Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-[#090B10] text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0D111A] border-r border-white/10 shrink-0">
        {/* Header Logo */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center shadow-redGlow">
            <Wrench className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <span className="font-heading font-black text-lg text-white block leading-none">
              APEX <span className="text-brand-red">ADMIN</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">
              Control Panel
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-brand-red text-white shadow-redGlow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Footer Profile */}
        <div className="p-4 border-t border-white/10 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center font-bold text-brand-red text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <span className="font-heading font-bold text-white text-xs block truncate">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-emerald-400 block flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> System Admin
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#0D111A]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-heading font-bold text-white text-base uppercase tracking-wider hidden sm:block">
              Apex Motors Master Garage System
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2"
            >
              <span>View Customer Website</span>
            </a>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0D111A] border-b border-white/10 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isActive(item.path)
                      ? 'bg-brand-red text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
