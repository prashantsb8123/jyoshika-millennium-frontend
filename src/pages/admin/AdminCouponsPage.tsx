import React, { useEffect, useState } from 'react';
import { Tag, Plus, X, Trash2, Power } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fetchAdminCoupons, createAdminCoupon, toggleAdminCoupon, deleteAdminCoupon } from '../../services/api';
import { Coupon } from '../../types';

const emptyForm = {
  code: '',
  discountPercentage: '',
  maxDiscount: '',
  minOrderValue: '',
  expiryDate: '',
  usageLimit: '1000',
};

export const AdminCouponsPage: React.FC = () => {
  const { token, showToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchAdminCoupons(token);
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    if (!token) return;
    if (!form.code.trim() || !form.discountPercentage || !form.expiryDate) {
      showToast('Please fill in code, discount %, and expiry date', 'error');
      return;
    }
    setSaving(true);
    const result = await createAdminCoupon(
      {
        code: form.code.trim().toUpperCase(),
        discountPercentage: Number(form.discountPercentage),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : 0,
        expiryDate: new Date(form.expiryDate).toISOString(),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : 1000,
        isActive: true,
      },
      token
    );
    setSaving(false);
    if (result.success) {
      showToast('Coupon created successfully', 'success');
      setShowModal(false);
      setForm(emptyForm);
      load();
    } else {
      showToast(result.message || 'Failed to create coupon', 'error');
    }
  };

  const handleToggle = async (id: string) => {
    if (!token) return;
    const result = await toggleAdminCoupon(id, token);
    if (result.success) {
      load();
    } else {
      showToast('Failed to update coupon', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const result = await deleteAdminCoupon(id, token);
    if (result.success) {
      showToast('Coupon deleted', 'success');
      load();
    } else {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-gold" /> Discount Coupons & Offers
          </h2>
          <p className="text-xs text-neutral-500">Manage promotional voucher codes, minimum order requirements, and expiration dates.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gold text-black font-bold text-xs rounded-xl shadow-sm hover:brightness-105 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create Coupon Code
        </button>
      </div>

      {loading ? (
        <p className="text-xs text-neutral-500">Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-10 text-center text-xs text-neutral-500">
          No coupons yet. Create your first discount code above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-extrabold text-gold bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 tracking-wider">
                  {c.code}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                  {c.isActive ? 'ACTIVE' : 'DISABLED'}
                </span>
              </div>

              <div className="text-xs text-neutral-500 space-y-1 pt-2 border-t border-neutral-200 font-mono">
                <div>Discount: {c.discountPercentage}% OFF{c.maxDiscount ? ` (max ₹${Number(c.maxDiscount).toLocaleString()})` : ''}</div>
                <div>Min Order: ₹{Number(c.minOrderValue || 0).toLocaleString()}</div>
                <div>Expires: {new Date(c.expiryDate).toLocaleDateString()}</div>
                <div>Used: {c.timesUsed ?? 0} / {c.usageLimit ?? '∞'}</div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => handleToggle(c.id)}
                  className="flex-1 px-3 py-1.5 bg-neutral-100 text-neutral-700 text-[11px] font-bold rounded-lg hover:bg-neutral-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Power className="w-3.5 h-3.5" /> {c.isActive ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[9998] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-lg font-bold text-neutral-900">Create Coupon Code</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Coupon Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 uppercase font-mono focus:outline-none focus:border-gold" placeholder="e.g. SAVE10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Discount % *</label>
                  <input type="number" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold" placeholder="10" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold" placeholder="2000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Min Order Value (₹)</label>
                  <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold" placeholder="500" />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Expiry Date *</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gold" />
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={saving}
              className="w-full py-3 bg-gold text-black font-bold text-xs rounded-xl shadow-sm hover:brightness-105 cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
