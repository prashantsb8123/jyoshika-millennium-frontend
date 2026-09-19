import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex font-sans selection:bg-gold-light selection:text-black">
      {/* Desktop Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 hidden md:flex shadow-xs">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-ink leading-none">JYOSHIKA MILLENNIUM</h2>
              <p className="text-[9px] tracking-[0.25em] text-gold uppercase font-semibold mt-1">Admin Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gold-light text-black font-bold shadow-xs'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gold'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-black" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin info */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-700">
            <div>
              <p className="font-bold text-neutral-900">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-neutral-500">{user?.email}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              ROLE_ADMIN
            </span>
          </div>

          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
            <a
              href="#"
              className="text-[11px] text-gold hover:underline flex items-center gap-1 font-semibold"
            >
              <ExternalLink className="w-3 h-3" /> View Storefront
            </a>

            <button
              onClick={() => {
                logout();
                window.location.hash = '#admin-login';
              }}
              className="p-1.5 text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer Modal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-xs bg-white border-r border-neutral-200 shadow-2xl flex flex-col justify-between overflow-y-auto md:hidden"
            >
              <div>
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-sm font-bold text-ink leading-none">JYOSHIKA MILLENNIUM</h2>
                    <p className="text-[8px] tracking-[0.25em] text-gold uppercase font-semibold mt-1">Admin Console</p>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-neutral-500 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="p-3 space-y-1 text-xs font-medium">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gold-light text-black font-bold shadow-xs'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gold'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-4 h-4 text-black" />}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-700">
                  <div>
                    <p className="font-bold text-neutral-900">{user?.name || 'Administrator'}</p>
                    <p className="text-[10px] text-neutral-500">{user?.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    ADMIN
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <a
                    href="#"
                    className="text-[11px] text-gold hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3 h-3" /> View Storefront
                  </a>

                  <button
                    onClick={() => {
                      logout();
                      window.location.hash = '#admin-login';
                    }}
                    className="p-1 text-rose-600 font-bold hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-neutral-800 hover:text-gold cursor-pointer rounded-lg hover:bg-neutral-100"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="font-serif text-base sm:text-lg font-bold text-neutral-900 capitalize truncate">
              {navItems.find((n) => n.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                logout();
                window.location.hash = '#admin-login';
              }}
              className="px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg hover:bg-rose-100 cursor-pointer flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Horizontal Tab Scrollbar for Quick Nav */}
        <div className="md:hidden bg-white border-b border-neutral-200 px-3 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-medium scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gold-light text-black font-bold shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-gold'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
