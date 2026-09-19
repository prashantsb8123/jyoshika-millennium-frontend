import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, ShieldCheck, Star, Truck, RefreshCw, Heart, ShoppingBag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, formatPrice, addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeChecked, setPincodeChecked] = useState<boolean>(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const inStock = product.stockQuantity > 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white text-neutral-900 rounded-t-3xl sm:rounded-2xl w-full max-w-4xl overflow-hidden border border-neutral-200 shadow-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-1.5 sm:p-2 rounded-full bg-white/90 text-neutral-700 hover:text-black border border-neutral-200 shadow-md cursor-pointer transition-transform active:scale-90"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-neutral-200 flex-1">
            {/* Gallery Section */}
            <div className="p-3.5 sm:p-6 bg-cream flex flex-col justify-between space-y-3">
              <div className="relative aspect-square sm:aspect-square max-h-[260px] sm:max-h-none rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-xs mx-auto w-full">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-center sm:justify-start">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx ? 'border-gold scale-105 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-4 sm:p-8 flex flex-col justify-between space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-gold uppercase tracking-wider">
                  <span>{product.category}</span>
                </div>

                <h2 className="font-serif text-base sm:text-2xl font-bold text-neutral-900 leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
                  <div className="flex items-center text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 mr-1" />
                    {product.rating} ({product.reviewCount})
                  </div>
                  <span className={`font-semibold flex items-center gap-1 ${inStock ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <Check className="w-3 h-3" /> {inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Pricing */}
                <div className="bg-cream p-3 sm:p-4 rounded-xl border border-neutral-200">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-serif text-lg sm:text-2xl font-bold text-gold">
                      {formatPrice(hasSale ? (product.salePrice as number) : product.price)}
                    </span>
                    {hasSale && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-4">
                  {product.description}
                </p>

                {/* Delivery Checker */}
                <div className="text-[11px] sm:text-xs">
                  <label className="font-semibold block mb-1">Delivery Estimator</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value);
                        setPincodeChecked(false);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs focus:outline-none focus:border-gold"
                    />
                    <button
                      onClick={() => setPincodeChecked(true)}
                      className="px-3.5 py-1.5 bg-gold text-black font-bold rounded-lg text-xs hover:brightness-105 cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeChecked && (
                    <p className="mt-1 text-emerald-600 font-medium flex items-center gap-1 text-[10px] sm:text-xs">
                      <Truck className="w-3.5 h-3.5" /> Free Delivery in 3-4 days.
                    </p>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2 pt-3 border-t border-neutral-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      setQuickViewProduct(null);
                    }}
                    disabled={!inStock}
                    className="flex-1 py-2.5 sm:py-3 rounded-xl bg-gold text-black font-bold text-xs sm:text-sm hover:brightness-105 shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {inStock ? 'Add To Cart' : 'Out of Stock'}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'border-neutral-300 text-neutral-600 hover:border-rose-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine Products
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> 30-Day Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
