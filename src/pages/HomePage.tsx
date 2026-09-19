import React, { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { Product } from '../types';
import { ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchProducts().then(setProducts);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Hero Copy */}
          <div className="space-y-6 max-w-xl">
            <div className="flex items-center gap-2 text-ink-soft">
              <span className="w-8 h-px bg-gold" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">New Season Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-ink leading-[1.08]">
              Timeless Jewellery,{' '}
              <span className="italic text-gold">Delivered</span> to Your Door.
            </h1>

            <p className="text-sm text-ink-soft max-w-md leading-relaxed">
              Discover fine jewellery, accessories and gifts for every occasion — all in one place. Quality craftsmanship,
              fair prices, and a shopping experience you can trust.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#shop" className="btn-primary">
                Shop Now <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#collections" className="btn-outline">
                Browse Categories
              </a>
            </div>
          </div>

          {/* Hero Imagery */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 row-span-2 aspect-3/4 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
                alt="Jyoshika Millennium Collection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
                alt="Featured products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square bg-ink flex flex-col items-center justify-center text-center p-4">
              <span className="font-serif text-3xl text-white">100%</span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-light mt-1">Genuine Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="eyebrow">Explore</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">Shop By Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#category-${cat.slug}`}
              className="group relative overflow-hidden bg-cream border border-line hover:border-gold transition-all aspect-3/4 flex flex-col justify-end p-3"
            >
              <img
                src={cat.imageUrl || cat.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"></div>
              <div className="relative z-10 text-center text-white">
                <h3 className="font-serif text-xs font-semibold uppercase tracking-wider">
                  {cat.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="eyebrow">Handpicked</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">Featured Products</h2>
          </div>

          <a
            href="#shop"
            className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            View All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {(featuredProducts.length > 0 ? featuredProducts : products).slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="eyebrow">Just In</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">New Arrivals</h2>
          </div>

          <a
            href="#shop"
            className="text-xs font-semibold text-gold hover:underline flex items-center gap-1 uppercase tracking-wider"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {(newArrivals.length > 0 ? newArrivals : products.slice().reverse()).slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
