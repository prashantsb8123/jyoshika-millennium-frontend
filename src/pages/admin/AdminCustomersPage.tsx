import React, { useEffect, useState } from 'react';
import { Users, Search, Crown, Mail, Phone } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fetchAdminCustomers } from '../../services/api';
import { CustomerSummary } from '../../types';

const getTier = (totalSpent: number): { label: string; className: string } => {
  if (totalSpent >= 300000) return { label: 'Crown Royalty', className: 'bg-amber-50 text-amber-900 border-amber-200' };
  if (totalSpent >= 100000) return { label: 'Gold VIP', className: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
  return { label: 'Standard Member', className: 'bg-neutral-100 text-neutral-700 border-neutral-200' };
};

export const AdminCustomersPage: React.FC = () => {
  const { token, formatPrice } = useStore();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchAdminCustomers(token).then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, [token]);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      (c.phone || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-gold" /> Customer Directory & Loyalty
          </h2>
          <p className="text-xs text-neutral-500">View registered customers, total purchases, and loyalty points.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
        <input
          type="text"
          placeholder="Search client name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-neutral-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-gold"
        />
      </div>

      {loading ? (
        <p className="text-xs text-neutral-500">Loading customers...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-10 text-center text-xs text-neutral-500">
          No registered customers yet.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-50 text-gold font-serif border-b border-neutral-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Loyalty Tier</th>
                    <th className="py-3 px-4">Reward Points</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Orders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 text-neutral-700">
                  {filtered.map((client) => {
                    const tier = getTier(client.totalSpent);
                    return (
                      <tr key={client.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-neutral-900">{client.name}</p>
                          <span className="text-[10px] text-neutral-500">
                            Joined {client.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-neutral-800">{client.email}</p>
                          <span className="text-[10px] font-mono text-neutral-500">{client.phone || '—'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tier.className}`}>
                            <Crown className="w-3 h-3 text-gold" /> {tier.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                          {client.rewardPoints} Pts
                        </td>
                        <td className="py-3 px-4 font-serif font-bold text-gold">
                          {formatPrice(client.totalSpent)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {client.ordersCount} Orders
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((client) => {
              const tier = getTier(client.totalSpent);
              return (
                <div key={client.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 text-xs shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">{client.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Joined {client.joinedDate ? new Date(client.joinedDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tier.className}`}>
                      <Crown className="w-3 h-3 text-gold" /> {tier.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gold" /> {client.email}</p>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gold" /> {client.phone || '—'}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Total Spent</span>
                      <span className="font-serif font-bold text-gold">{formatPrice(client.totalSpent)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Points</span>
                      <span className="font-mono font-bold text-emerald-700">{client.rewardPoints}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Orders</span>
                      <span className="font-mono font-bold text-neutral-800">{client.ordersCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
