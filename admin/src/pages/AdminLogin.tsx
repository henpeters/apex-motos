import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/api';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@apexmotors.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = await loginAdmin({ email, password });
      login(data);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090B10] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md admin-card p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-red to-red-700 flex items-center justify-center shadow-redGlow mx-auto mb-3">
            <Wrench className="w-7 h-7 text-white stroke-[2.5]" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white uppercase tracking-wider">
            Apex Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with administrator credentials to manage shop catalog, orders, and content.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-red" />
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-red" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-redGlow disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <span className="text-[11px] text-slate-500 block">Development Credentials:</span>
          <code className="text-xs text-brand-red font-mono font-bold block mt-1">
            admin@apexmotors.com / admin123
          </code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
