import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchMyOrders, requestOrderReturn } from '../services/api';
import { Order, ReturnType } from '../types';
import { User, ShoppingBag, Crown, ShieldCheck, MapPin, LogOut, RotateCcw, X } from 'lucide-react';

const RETURN_WINDOW_DAYS = 30;

const ORDER_STATUS_STYLES: Record<string, string> = {
  DELIVERED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  CANCELLED: 'bg-rose-100 text-rose-700 border border-rose-200',
  RETURN_REQUESTED: 'bg-amber-100 text-amber-800 border border-amber-200',
  RETURNED: 'bg-neutral-200 text-neutral-700 border border-neutral-300',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
};

const statusBadgeClass = (status: string) =>
  ORDER_STATUS_STYLES[status] || 'bg-blue-50 text-blue-700 border border-blue-200';

const isReturnEligible = (order: Order) => {
  if (order.status !== 'DELIVERED') return false;
  const daysSinceOrder = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceOrder <= RETURN_WINDOW_DAYS;
};

export const CustomerAccountPage: React.FC = () => {
  const { user, token, logout, formatPrice, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [returnType, setReturnType] = useState<ReturnType>('RETURN');
  const [returnReason, setReturnReason] = useState<string>('');
  const [submittingReturn, setSubmittingReturn] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    fetchMyOrders(token).then(setOrders).catch((err) => console.warn(err));
  }, [token]);

  const openReturnModal = (order: Order) => {
    setReturnModalOrder(order);
    setReturnType('RETURN');
    setReturnReason('');
  };

  const handleSubmitReturn = async () => {
    if (!returnModalOrder) return;
    if (!returnReason.trim()) {
      showToast('Please tell us the reason for your request', 'error');
      return;
    }

    setSubmittingReturn(true);
    const res = await requestOrderReturn(
      returnModalOrder.id,
      { returnType, reason: returnReason.trim() },
      token || undefined
    );
    setSubmittingReturn(false);

    if (res.success && res.data) {
      const updatedOrder = res.data;
      setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
      showToast(
        returnType === 'EXCHANGE' ? 'Exchange request submitted' : 'Return request submitted',
        'success'
      );
      setReturnModalOrder(null);
    } else {
      showToast(res.message || 'Failed to submit your request', 'error');
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <User className="w-12 h-12 text-gold-light mx-auto" />
        <h2 className="font-serif text-2xl font-medium text-ink">Sign In To View Your Account</h2>
        <a href="#auth-login" className="btn-primary inline-flex">
          Customer Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold text-black font-serif font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-neutral-900">{user.name}</h1>
            <p className="text-xs text-neutral-500">{user.email} • {user.phone}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-gold border border-amber-200">
              <Crown className="w-3 h-3 text-gold" /> Rewards Member ({user.rewardPoints || 1250} Pts)
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.hash = '#';
          }}
          className="px-4 py-2 bg-neutral-100 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-50 cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Order History */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <h2 className="font-serif text-lg font-bold text-neutral-900 uppercase border-b border-neutral-200 pb-3 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-gold" /> Order & Delivery History
        </h2>

        {orders.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">No orders placed yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-cream rounded-2xl border border-neutral-200 text-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-neutral-900">{ord.orderNumber}</h4>
                    <span className="text-[10px] text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded font-bold text-[10px] ${statusBadgeClass(ord.status)}`}>
                    {ord.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center text-neutral-500 pt-2 border-t border-neutral-200">
                  <span>AWB Tracking: <strong className="font-mono text-neutral-900">{ord.trackingNumber}</strong></span>
                  <span className="font-serif font-bold text-gold text-sm">{formatPrice(ord.totalAmount)}</span>
                </div>

                {ord.status === 'RETURN_REQUESTED' || ord.status === 'RETURNED' ? (
                  <div className="pt-2 border-t border-neutral-200 flex items-start gap-1.5 text-amber-800">
                    <RotateCcw className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      {ord.returnType === 'EXCHANGE' ? 'Exchange' : 'Return'} requested
                      {ord.returnReason ? `: ${ord.returnReason}` : ''}
                    </span>
                  </div>
                ) : isReturnEligible(ord) ? (
                  <div className="pt-2 border-t border-neutral-200">
                    <button
                      onClick={() => openReturnModal(ord)}
                      className="px-3 py-1.5 bg-amber-50 text-gold border border-amber-200 rounded-lg font-bold text-[11px] cursor-pointer flex items-center gap-1.5 hover:bg-amber-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Return / Exchange Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white text-neutral-900 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-serif text-lg font-bold text-gold">Return or Exchange</h3>
              <button
                onClick={() => setReturnModalOrder(null)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              Order <span className="font-mono text-neutral-900">{returnModalOrder.orderNumber}</span> — within our
              {' '}{RETURN_WINDOW_DAYS}-day return window.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setReturnType('RETURN')}
                className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                  returnType === 'RETURN'
                    ? 'border-gold bg-amber-50 text-neutral-900'
                    : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Return for Refund
              </button>
              <button
                type="button"
                onClick={() => setReturnType('EXCHANGE')}
                className={`p-3 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                  returnType === 'EXCHANGE'
                    ? 'border-gold bg-amber-50 text-neutral-900'
                    : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Exchange Item
              </button>
            </div>

            <div>
              <label className="block text-neutral-600 mb-1 text-xs font-semibold">Reason</label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                rows={3}
                placeholder="Tell us what went wrong..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReturnModalOrder(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReturn}
                disabled={submittingReturn}
                className="px-6 py-2 rounded-lg bg-gold text-black font-bold text-xs hover:brightness-105 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {submittingReturn ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
