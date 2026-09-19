import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { fetchOrderById } from '../services/api';
import { Order } from '../types';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { CheckCircle2, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { formatPrice, token } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#order-success-')) {
        const id = hash.replace('#order-success-', '');
        const data = await fetchOrderById(id, token || undefined);
        if (data) setOrder(data);
      }
    };
    handleHash();
  }, [token]);

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold">Order Confirmed!</h2>
        <a href="#shop" className="inline-block px-6 py-3 bg-gold text-black font-bold text-xs uppercase rounded-xl">
          Continue Browsing Vault
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-white border border-neutral-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-serif font-bold text-gold uppercase tracking-widest">
            Armored Transit Vault Dispatched
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-neutral-900 uppercase">
            Order #{order.orderNumber} Confirmed!
          </h1>
          <p className="text-xs text-neutral-500">
            Thank you, {order.customerName}. Your 100% insured delivery is being prepared at our Mumbai vault.
          </p>
        </div>

        <div className="p-4 bg-cream rounded-2xl border border-neutral-200 text-xs text-left space-y-2">
          <div className="flex justify-between font-bold text-neutral-900">
            <span>Order Status:</span>
            <span className="font-mono text-gold">{order.status || 'Placed'}</span>
          </div>
          {order.trackingNumber && (
            <div className="flex justify-between text-neutral-500">
              <span>Tracking Number:</span>
              <span className="font-mono">{order.trackingNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-500">
            <span>Total Amount Paid:</span>
            <span className="font-serif font-bold text-neutral-900">{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="px-6 py-3 bg-white text-neutral-900 border border-gold font-bold text-xs rounded-xl hover:bg-amber-50 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-gold" /> Print GST Tax Invoice
          </button>

          <a
            href="#shop"
            className="px-6 py-3 bg-gold text-black font-bold text-xs uppercase rounded-xl hover:brightness-105 flex items-center gap-1 shadow-md"
          >
            Explore More Fine Pieces <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {showInvoiceModal && <InvoiceModal order={order} onClose={() => setShowInvoiceModal(false)} />}
    </div>
  );
};
