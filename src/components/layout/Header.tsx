import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { fetchCategories, fetchProducts } from '../../services/api';
import { Product } from '../../types';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ANNOUNCEMENTS = [
  'FREE SHIPPING ON ORDERS ₹999+',
  'FREE 30-DAY RETURNS',
  'SECURE PAYMENTS · 24/7 SUPPORT',
];

const PRIMARY_LINKS = [
  { label: 'Shop All', hash: '#shop' },
];

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    user,
    logout,
    isSearchOpen,
    setIsSearchOpen
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      fetchProducts({ search: searchQuery.trim() }).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-ink text-white overflow-hidden">
        <div className="relative h-9 flex items-center">
          <div className="flex items-center gap-16 whitespace-nowrap animate-marquee px-4">
            {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((msg, i) => (
              <span key={i} className="flex items-center gap-16 text-[10px] font-semibold tracking-[0.15em] uppercase">
                {msg}
                <span className="text-gold-light">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-line transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden shrink-0 p-2 -ml-2 text-ink hover:text-gold cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Wordmark */}
          <a href="#" className="flex flex-col items-start min-w-0 flex-1 lg:flex-none shrink lg:shrink-0">
            <span className="font-serif text-base sm:text-2xl lg:text-3xl font-bold tracking-tight text-ink truncate max-w-full">
              JYOSHIKA MILLENNIUM
            </span>
            <span className="text-[9px] tracking-[0.3em] text-ink-soft uppercase font-medium truncate max-w-full">
              Online Shopping
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-8 text-xs font-semibold uppercase tracking-wider text-ink">
            <a href="#" className="hover:text-gold transition-colors">
              Home
            </a>

            <div
              className="relative py-6"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-gold transition-colors py-1 cursor-pointer">
                Collections
                <ChevronDown className={`w-3 h-3 text-ink-soft transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Collections Mega Menu */}
              <AnimatePresence>
                {isCollectionsOpen && categories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[560px] bg-white border border-line shadow-2xl p-6 grid grid-cols-3 gap-6 z-50 normal-case tracking-normal"
                  >
                    {categories.slice(0, 3).map((cat) => (
                      <div key={cat.id}>
                        <h4 className="font-serif text-sm font-semibold text-gold mb-3 pb-2 border-b border-line">
                          {cat.name}
                        </h4>
                        <ul className="space-y-2 text-xs text-ink-soft">
                          <li>
                            <a href={`#category-${cat.slug}`} className="hover:text-gold transition-colors block py-0.5">
                              View All {cat.name}
                            </a>
                          </li>
                          {(cat.subCategories || []).slice(0, 4).map((sub: string, i: number) => (
                            <li key={i}>
                              <a href="#shop" className="hover:text-gold transition-colors block py-0.5">
                                {sub}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {PRIMARY_LINKS.map((link) => (
              <a key={link.hash} href={link.hash} className="hover:text-gold transition-colors">
                {link.label}
              </a>
            ))}

            {categories.map((cat) => (
              <a key={cat.id} href={`#category-${cat.slug}`} className="hover:text-gold transition-colors">
                {cat.name}
              </a>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex p-1.5 sm:p-2 text-ink hover:text-gold transition-colors cursor-pointer"
              title="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <a
              href="#wishlist"
              className="hidden sm:flex relative p-1.5 sm:p-2 text-ink hover:text-gold transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-ink text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-ink hover:text-gold transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-ink rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Admin Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-1.5 sm:p-2 text-ink hover:text-gold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UserIcon className="w-5 h-5" />
                {user && <span className="hidden md:inline text-xs font-semibold">{user?.name?.split(' ')[0] || ""}</span>}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white border border-line shadow-2xl p-3 z-50 text-xs space-y-2"
                  >
                    {user ? (
                      <div>
                        <div className="px-3 py-2 border-b border-line">
                          <p className="font-semibold text-ink">{user.name}</p>
                          <p className="text-[11px] text-ink-soft">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-gold-pale text-gold">
                            {user.role === 'ROLE_ADMIN' ? 'ADMIN' : `Rewards: ${user.rewardPoints} pts`}
                          </span>
                        </div>

                        {user.role === 'ROLE_ADMIN' && (
                          <a
                            href="#admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-gold font-semibold hover:bg-cream"
                          >
                            <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                          </a>
                        )}

                        <a
                          href="#account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-ink hover:bg-cream"
                        >
                          My Orders & Addresses
                        </a>

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <a
                          href="#auth-login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="btn-primary w-full"
                        >
                          Customer Sign In
                        </a>
                        <a
                          href="#admin-login"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block w-full text-center py-2 text-xs font-semibold text-gold hover:underline"
                        >
                          Admin Access Portal (/admin)
                        </a>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer (Hamburger Menu) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-sm bg-white border-r border-line shadow-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-line">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-ink text-lg leading-none">JYOSHIKA MILLENNIUM</span>
                    <span className="text-[8px] tracking-[0.25em] text-ink-soft uppercase">Online Shopping</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-ink-soft hover:text-ink cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-1 gap-3 text-xs">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-cream text-ink font-medium cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-gold" /> Search
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <span className="eyebrow block px-1">Shop</span>
                  <div className="space-y-1">
                    <a
                      href="#"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2.5 font-serif text-sm font-semibold text-ink hover:bg-cream hover:text-gold"
                    >
                      Home
                    </a>
                    {PRIMARY_LINKS.map((link) => (
                      <a
                        key={link.hash}
                        href={link.hash}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2.5 font-serif text-sm font-semibold text-ink hover:bg-cream hover:text-gold"
                      >
                        {link.label}
                      </a>
                    ))}
                    {categories.map((cat) => (
                      <a
                        key={cat.id}
                        href={`#category-${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2.5 text-xs font-medium text-ink-soft hover:bg-cream hover:text-gold"
                      >
                        {cat.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Account & Bag Links */}
                <div className="space-y-2 border-t border-line pt-4">
                  <span className="eyebrow block px-1">My Account</span>
                  <a
                    href="#wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-xs font-medium text-ink-soft hover:bg-cream"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" /> Wishlist
                    </span>
                    {wishlist.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                        {wishlist.length}
                      </span>
                    )}
                  </a>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium text-ink-soft hover:bg-cream text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-gold" /> Shopping Bag
                    </span>
                    {cartCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-gold text-ink font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <a
                    href={user ? '#account' : '#auth-login'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-ink-soft hover:bg-cream"
                  >
                    <UserIcon className="w-4 h-4 text-ink-soft" />
                    {user ? `Account (${user.name})` : 'Customer Sign In'}
                  </a>

                  {user?.role === 'ROLE_ADMIN' && (
                    <a
                      href="#admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-gold hover:bg-cream"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </a>
                  )}
                </div>
              </div>

              {/* Footer in Drawer */}
              <div className="pt-6 border-t border-line space-y-3">
                <div className="flex items-center justify-between text-xs text-ink-soft font-medium">
                  <span>Currency:</span>
                  <span className="font-semibold text-ink">INR (₹)</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Smart Search Drawer Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-start pt-20">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl bg-white border border-line shadow-2xl p-6 relative space-y-4"
            >
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-4 right-4 p-2 text-ink-soft hover:text-ink cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 border-b border-line pb-3">
                <Search className="w-6 h-6 text-gold" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search for jewellery, accessories and gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-lg font-serif bg-transparent text-ink focus:outline-none"
                />
              </div>

              {/* Search Suggestions */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft block mb-2">
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Gold Necklace', 'Diamond Ring', 'Bangles', 'Bridal Jewellery', 'Gift Hampers'].map((kw) => (
                    <button
                      key={kw}
                      onClick={() => setSearchQuery(kw)}
                      className="px-3 py-1 bg-cream hover:bg-gold hover:text-ink text-ink-soft transition-colors cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Search Results */}
              {searchQuery && (
                <div className="max-h-60 overflow-y-auto space-y-2 pt-2 divide-y divide-line">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        useStore.getState().setQuickViewProduct(item);
                        setIsSearchOpen(false);
                      }}
                      className="pt-2 flex items-center justify-between hover:bg-cream p-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.images[0]} alt={item.title} className="w-12 h-12 object-cover" />
                        <div>
                          <h5 className="font-serif text-xs font-semibold text-ink">{item.title}</h5>
                          <span className="text-[10px] text-ink-soft">{item.category}</span>
                        </div>
                      </div>
                      <span className="font-serif text-xs font-semibold text-gold">{useStore.getState().formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
