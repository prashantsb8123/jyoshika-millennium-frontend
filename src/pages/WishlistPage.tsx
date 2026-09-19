import React from 'react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
          Saved Favorites
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-neutral-900 uppercase">
          Your Wishlist ({wishlist.length})
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <Heart className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-neutral-900">Your wishlist is empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Explore our rings, necklaces, and earrings to save your favorite pieces.
          </p>
          <a
            href="#shop"
            className="inline-block px-6 py-3 bg-gold text-black font-bold text-xs uppercase rounded-xl hover:brightness-110 shadow-lg"
          >
            Explore Fine Collections
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
