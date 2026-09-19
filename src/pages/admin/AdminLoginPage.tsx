import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { loginUser } from '../../services/api';
import { ShieldCheck, Lock, Mail, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminLoginPage: React.FC = () => {
  const { setUser, showToast } = useStore();
  const [email, setEmail] = useState<string>('admin@jyoshikamillennium.com');
  const [password, setPassword] = useState<string>('Admin@123456');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await loginUser(email, password);
    setLoading(false);

    if (res.success && res.user && res.user.role === 'ROLE_ADMIN') {
      setUser(res.user, res.token);
      showToast('Welcome to the Jyoshika Millennium admin portal', 'success');
      window.location.hash = '#admin';
    } else {
      setErrorMsg('Authentication Failed. Please check Admin Email and Password.');
      showToast('Admin Authentication Failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-light/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Logo */}
        <div className="text-center space-y-1">
          <h1 className="font-serif text-2xl font-bold text-ink">JYOSHIKA MILLENNIUM</h1>
          <p className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">Admin Portal</p>
        </div>

        {/* Notice Badge */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-gold" /> Protected Admin Route (/admin)
          </p>
          <p className="text-[11px] text-neutral-600">
            Pre-seeded Executive Credentials:<br />
            Email: <strong className="text-neutral-900 font-mono">admin@jyoshikamillennium.com</strong><br />
            Password: <strong className="text-neutral-900 font-mono">Admin@123456</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 font-mono focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-bold text-xs rounded-xl shadow-md hover:brightness-105 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying Admin Credentials...' : 'Authenticate Admin Session'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="#" className="text-xs text-neutral-500 hover:text-gold">
            ← Return to Storefront
          </a>
        </div>
      </motion.div>
    </div>
  );
};
