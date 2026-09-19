import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { Heart, Eye, ShoppingBag, Star, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    formatPrice,
    toggleWishlist,
    isInWishlist,
    addToCart,
    addToCompare,
    isInCompare,
    setQuickViewProduct,
  } = useStore();

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const discountPercentage = hasSale
    ? Math.round((1 - (product.salePrice as number) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-xl border border-neutral-200 hover:border-gold/60 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-cream cursor-pointer">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isBestSeller && (
            <span className="bg-gold text-black text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs">
              New Arrival
            </span>
          )}
          {discountPercentage > 0 ? (
            <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercentage}%
            </span>
          ) : null}
        </div>

        {/* Action Overlay Buttons */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-neutral-600 hover:text-rose-600 hover:bg-white border border-neutral-200'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 text-neutral-600 hover:text-gold hover:bg-white border border-neutral-200 backdrop-blur-md transition-all shadow-xs cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Compare */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCompare(product);
            }}
            className={`p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isCompared
                ? 'bg-gold text-black font-bold'
                : 'bg-white/90 text-neutral-600 hover:text-gold hover:bg-white border border-neutral-200'
            }`}
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div className="space-y-1">
          {/* Category Tag */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500">
            <span className="font-semibold text-gold uppercase tracking-wider truncate">{product.category}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-serif text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 hover:text-gold transition-colors cursor-pointer leading-snug"
          >
            {product.title}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-[10px] sm:text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
            <span className="font-bold ml-0.5 text-neutral-900">{product.rating}</span>
          </div>
          <span className="text-neutral-400 text-[10px]">({product.reviewCount})</span>
        </div>

        {/* Price & Add To Cart CTA */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            <div className="font-serif text-sm sm:text-base font-bold text-gold truncate">
              {formatPrice(hasSale ? (product.salePrice as number) : product.price)}
            </div>
            {hasSale && (
              <div className="text-[10px] sm:text-[11px] text-neutral-400 line-through truncate">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="p-2 sm:p-2.5 rounded-lg bg-gold text-black font-bold hover:brightness-105 transition-all duration-200 cursor-pointer shadow-xs shrink-0"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
