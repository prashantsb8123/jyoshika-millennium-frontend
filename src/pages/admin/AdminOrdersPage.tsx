import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { ShoppingBag, Printer, Truck, Check, RefreshCw, Eye, Search } from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'RETURNED'
];

export const AdminOrdersPage: React.FC = () => {
  const { token, formatPrice, showToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadOrders = async () => {
    setLoading(true);
    if (token) {
      const data = await fetchAdminOrders(token);
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const res = await updateAdminOrderStatus(orderId, newStatus, token || '');
    if (res.success) {
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders();
    } else {
      showToast(res.message || 'Status update failed', 'error');
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gold" /> Insured Order Dispatch & Logistics
          </h2>
          <p className="text-xs text-neutral-500">Process orders, update BlueDart vault tracking, and issue GST tax invoices.</p>
        </div>

        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-neutral-100 border border-neutral-300 text-xs text-neutral-700 rounded-xl hover:bg-neutral-200 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by Order # or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Orders Table (Desktop) & Mobile Cards */}
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-gold font-serif border-b border-neutral-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order Details</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">Loading orders...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">No orders found.</td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50">
                      <td className="py-3 px-4">
                        <p className="font-serif font-bold text-neutral-900">{ord.orderNumber}</p>
                        <span className="text-[10px] text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        {ord.returnType && (
                          <p className="text-[10px] text-amber-700 font-semibold mt-0.5 max-w-[220px] line-clamp-2">
                            {ord.returnType === 'EXCHANGE' ? 'Exchange' : 'Return'} requested: {ord.returnReason}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-neutral-900">{ord.customerName}</p>
                        <span className="text-[10px] text-neutral-500">{ord.shippingAddress.city}, {ord.shippingAddress.state}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {ord.items.length} Items
                      </td>
                      <td className="py-3 px-4 font-serif font-bold text-gold">
                        {formatPrice(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-white border border-neutral-300 text-neutral-800 text-xs rounded px-2 py-1 focus:outline-none focus:border-gold cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-1.5 bg-neutral-100 text-gold border border-neutral-300 rounded-lg hover:bg-gold-light hover:text-black font-semibold text-xs transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> GST Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {loading ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-white p-4 rounded-2xl border border-neutral-200">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 bg-white p-4 rounded-2xl border border-neutral-200">
              No orders found.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div key={ord.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 text-xs shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif font-extrabold text-neutral-900 text-sm">{ord.orderNumber}</h4>
                    <p className="text-[10px] text-neutral-500">{new Date(ord.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-serif font-extrabold text-gold text-sm">
                    {formatPrice(ord.totalAmount)}
                  </span>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                  <p className="font-bold text-neutral-900">{ord.customerName}</p>
                  <p className="text-[11px] text-neutral-500">{ord.shippingAddress.addressLine1}, {ord.shippingAddress.city}</p>
                  <p className="text-[11px] font-mono text-neutral-700">{ord.items.length} Item(s)</p>
                  {ord.returnType && (
                    <p className="text-[11px] text-amber-700 font-semibold pt-1 border-t border-neutral-200 mt-1">
                      {ord.returnType === 'EXCHANGE' ? 'Exchange' : 'Return'} requested: {ord.returnReason}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-500 font-semibold">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-white border border-neutral-300 text-neutral-800 text-xs font-bold rounded px-2 py-1 focus:outline-none focus:border-gold"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="px-3 py-1.5 bg-amber-50 text-gold border border-amber-200 rounded-lg font-bold text-xs cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <Printer className="w-3.5 h-3.5" /> GST Invoice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} />
      )}
    </div>
  );
};
