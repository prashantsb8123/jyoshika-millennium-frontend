import React from 'react';
import { Order } from '../../types';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white text-neutral-900 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-neutral-300 my-8 p-8 flex flex-col justify-between space-y-6"
      >
        {/* Actions bar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-gold rounded-lg font-bold text-xs">GST Tax Invoice</span>
            <span className="text-xs text-neutral-500">Tax Invoice / Bill of Supply</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-black cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-neutral-200 pb-6">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900">JYOSHIKA MILLENNIUM</h1>
              <p className="text-xs text-neutral-500 font-medium">Fine Jewellery, Accessories & Gifts</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                GSTIN: 29AAAAA0000A1Z5<br />
                Gokul Park, Samarth Nagar, Near Elamma Tayi Temple, Vijayapur - 586109
              </p>
            </div>

            <div className="text-right">
              <div className="font-serif text-lg font-bold text-gold">TAX INVOICE</div>
              <p className="text-xs font-mono font-semibold">#{order.orderNumber}</p>
              <p className="text-[11px] text-neutral-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
            <div>
              <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-1">Billed & Shipped To</span>
              <p className="font-bold text-neutral-900">{order.customerName}</p>
              <p className="text-neutral-600">{order.shippingAddress.addressLine1}</p>
              <p className="text-neutral-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="text-neutral-600">Phone: {order.customerPhone}</p>
            </div>

            <div className="text-right">
              <span className="font-bold uppercase tracking-wider text-neutral-400 block mb-1">Payment & Logistics</span>
              <p className="font-medium">Method: <strong className="text-neutral-900">{order.paymentMethod}</strong></p>
              <p className="font-medium text-emerald-700">Status: {order.paymentStatus}</p>
              <p className="font-medium text-neutral-600">Courier: {order.courierPartner || 'Standard Shipping'}</p>
              <p className="font-mono text-neutral-500">AWB: {order.trackingNumber}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300 bg-neutral-100">
                <th className="py-2.5 px-3 font-semibold">Item</th>
                <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 px-3 font-medium text-neutral-900">{item.productTitle}</td>
                  <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">₹{item.totalPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Invoice Summary */}
          <div className="flex justify-between items-end pt-4 border-t border-neutral-300 text-xs">
            <div className="space-y-1 text-[11px] text-neutral-500 max-w-sm">
              <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" /> All items are 100% genuine and quality checked before shipping.
              </p>
              <p>Subject to Vijayapur Jurisdiction. E. & O.E.</p>
            </div>

            <div className="w-64 space-y-1.5 text-right font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST (3%):</span>
                <span>₹{order.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-300 font-serif">
                <span>Total Paid:</span>
                <span className="text-gold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-neutral-200 text-center text-[11px] text-neutral-400 print:hidden">
          Thank you for shopping with Jyoshika Millennium. For queries, contact support@jyoshikamillennium.com or +91 80 4567 8900.
        </div>
      </motion.div>
    </div>
  );
};
