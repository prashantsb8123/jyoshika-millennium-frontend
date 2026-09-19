import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchProducts, fetchCategories } from '../services/api';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Filter, SlidersHorizontal, Grid, List, X, PackageSearch } from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Handle hash category change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#category-')) {
        const slug = hash.replace('#category-', '');
        fetchCategories().then((cats) => {
          const foundCat = cats.find((c) => c.slug === slug);
          if (foundCat) setSelectedCategory(foundCat.name);
        });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filter logic
  let filtered = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sort logic
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    return (b.rating || 0) - (a.rating || 0); // Popularity default
  });

  // Active filter count
  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (maxPrice < 1000000 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2 border-b border-neutral-200 pb-6 sm:pb-8">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
          Shop Our Collection
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-neutral-900 uppercase">
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </h1>
        <p className="text-xs text-neutral-500 max-w-xl mx-auto px-2">
          Browse our full range of fine jewellery, accessories and gifts.
        </p>
      </div>

      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-cream p-3.5 sm:p-4 rounded-2xl border border-neutral-200">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              filterDrawerOpen || activeFilterCount > 0
                ? 'bg-gold text-white border-gold shadow-xs'
                : 'bg-white border-neutral-300 text-neutral-900 hover:border-gold'
            }`}
          >
            <Filter className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="text-xs font-medium text-neutral-500">
            <strong className="text-neutral-900 font-serif">{filtered.length}</strong> Products
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'bg-gold text-black font-bold' : 'text-neutral-400 hover:text-black'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-gold text-black font-bold' : 'text-neutral-400 hover:text-black'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none justify-end">
            <span className="hidden sm:inline text-neutral-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded-xl px-2.5 py-2 text-neutral-900 text-xs font-semibold focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-xs">
          <span className="text-[11px] font-bold uppercase text-gold mr-1">Active Filters:</span>

          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-300 font-medium text-neutral-800 shadow-xs">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-600 cursor-pointer ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {maxPrice < 1000000 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-amber-300 font-medium text-neutral-800 shadow-xs">
              Max: {formatPrice(maxPrice)}
              <button onClick={() => setMaxPrice(1000000)} className="hover:text-rose-600 cursor-pointer ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={() => {
              setSelectedCategory('All');
              setMaxPrice(1000000);
            }}
            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Container: Filters Above on Mobile, Side-by-Side on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Filter Panel */}
        <aside
          className={`w-full lg:w-64 shrink-0 transition-all ${
            filterDrawerOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-serif font-bold text-sm text-gold uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setMaxPrice(1000000);
                  }}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer font-medium"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="lg:hidden p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="font-bold text-neutral-900 block uppercase text-[10px] tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap lg:flex-col gap-1.5 max-h-48 lg:max-h-56 overflow-y-auto pr-1">
                {['All', ...categories.map((c) => c.name)].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                      selectedCategory === cat
                        ? 'bg-gold text-black font-bold shadow-xs'
                        : 'bg-neutral-50 lg:bg-transparent text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex justify-between font-bold text-neutral-900 uppercase text-[10px] tracking-wider">
                <span>Max Price</span>
                <span className="text-gold font-mono">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={500}
                max={1000000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer"
              />
            </div>

            {/* Mobile Apply Button */}
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="w-full py-2.5 bg-black text-white font-bold text-xs rounded-xl lg:hidden cursor-pointer hover:bg-neutral-800"
            >
              Apply Filters ({filtered.length} Results)
            </button>
          </div>
        </aside>

        {/* Product Grid - Positioned Below Filters on Mobile */}
        <main className="flex-1 w-full min-w-0">
          {loading ? (
            <div className="py-20 text-center text-gold space-y-2">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-serif font-bold">Loading Products...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-neutral-200 p-8 shadow-xs">
              <PackageSearch className="w-12 h-12 text-gold mx-auto" />
              <h3 className="font-serif text-lg font-bold text-neutral-900">No Products Match Your Filters</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try expanding your price range or clearing your category selection to view available inventory.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(1000000);
                }}
                className="px-5 py-2 bg-gold text-black font-bold text-xs rounded-xl shadow-md hover:brightness-110 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
