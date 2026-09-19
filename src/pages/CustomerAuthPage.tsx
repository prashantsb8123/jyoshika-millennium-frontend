import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { loginUser, registerCustomer } from '../services/api';
import { Lock, Mail, User as UserIcon, Phone, ShieldCheck } from 'lucide-react';

export const CustomerAuthPage: React.FC = () => {
  const { setUser, showToast } = useStore();
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      const res = await registerCustomer({ name, email, password, phone });
      setLoading(false);
      if (res.success && res.user) {
        setUser(res.user, res.token);
        showToast('Welcome to Jyoshika Millennium!', 'success');
        window.location.hash = '#account';
      } else {
        showToast(res.message || 'Registration failed', 'error');
      }
    } else {
      const res = await loginUser(email, password);
      setLoading(false);
      if (res.success && res.user) {
        setUser(res.user, res.token);
        showToast('Signed in successfully', 'success');
        window.location.hash = '#account';
      } else {
        showToast(res.message || 'Invalid credentials', 'error');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <span className="font-serif text-lg font-bold text-ink block">JYOSHIKA MILLENNIUM</span>
          <h2 className="font-serif text-xl font-medium text-ink">
            {isRegister ? 'Create Your Account' : 'Sign In'}
          </h2>
          <p className="text-xs text-ink-soft">Access order tracking, rewards, and saved addresses.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="email"
                required
                placeholder="patron@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9820011223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-9 pr-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-bold text-xs uppercase rounded-xl hover:brightness-105 shadow-sm cursor-pointer transition-all"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Patron Account' : 'Sign In To Vault'}
          </button>
        </form>

        <div className="text-center text-xs">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-gold font-bold hover:underline cursor-pointer"
          >
            {isRegister ? 'Already have an account? Sign In' : 'New Patron? Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
