import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { fetchAdminDashboard } from '../../services/api';
import { AdminAnalytics } from '../../types';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, AlertTriangle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { token, formatPrice } = useStore();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAdminDashboard(token || '').then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [token]);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-gold-light space-y-3">
        <div className="w-8 h-8 border-2 border-gold-light border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-serif font-bold">Loading Executive Analytics...</p>
      </div>
    );
  }

  const COLORS = ['#D4AF37', '#B38728', '#8B6B1B', '#F3E5AB', '#AA771C'];

  return (
    <div className="space-y-6">
      {/* Top Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2.5 rounded-xl bg-gold-light/10 text-gold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">{formatPrice(data.totalRevenue)}</div>
          <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> All-time paid revenue
          </p>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-gold-light/10 text-gold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">{data.totalOrders}</div>
          <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> On-Time Deliveries
          </p>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Customers</span>
            <div className="p-2.5 rounded-xl bg-gold-light/10 text-gold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">{data.totalCustomers}</div>
          <p className="text-amber-800 text-xs font-medium">Registered Members</p>
        </div>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Products</span>
            <div className="p-2.5 rounded-xl bg-gold-light/10 text-gold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-2xl font-bold text-neutral-900">{data.totalProducts} Catalog Items</div>
          <p className="text-emerald-600 text-xs font-medium">Across All Categories</p>
        </div>
      </div>

      {/* Revenue Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Line Chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Monthly Revenue Trend (INR)</h3>
              <p className="text-xs text-neutral-500">Sales performance across all categories</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRevenueChart}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666666" fontSize={11} />
                <YAxis stroke="#666666" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '8px', color: '#111827' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#B38728" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Distribution Pie */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-neutral-900">Sales Distribution</h3>
            <p className="text-xs text-neutral-500">Category share percentage</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categorySalesDistribution}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#D4AF37"
                  label={(entry) => entry.category}
                >
                  {data.categorySalesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '8px', color: '#111827' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-base font-bold text-neutral-900">Low Stock Alerts</h3>
          </div>

          <div className="space-y-3 text-xs">
            {data.lowStockItems.length === 0 ? (
              <p className="text-neutral-500">All products are well stocked.</p>
            ) : (
              data.lowStockItems.map((item) => (
                <div key={item.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                    )}
                    <p className="font-bold text-neutral-900 line-clamp-1">{item.title}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg border border-amber-200">
                    Only {item.stockQuantity} Left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Executive Info Box */}
        <div className="bg-amber-50/50 border border-gold-light/30 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-serif text-base font-bold text-neutral-900">Admin Security</h3>
          </div>
          <p className="text-xs text-neutral-700 leading-relaxed">
            The Jyoshika Millennium Admin Dashboard enforces strict role-based JWT authorization (`ROLE_ADMIN`). All product, order, and inventory changes are logged to audit trails.
          </p>
          <div className="p-3 bg-white border border-amber-200/80 rounded-xl text-xs space-y-1 text-neutral-800">
            <p><strong>System Status:</strong> Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};
