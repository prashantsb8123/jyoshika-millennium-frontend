import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Scale, X, ShoppingBag, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CompareDrawer: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, formatPrice, addToCart } = useStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating trigger bar */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gold text-black font-bold border border-gold px-4 py-3 rounded-full shadow-xl flex items-center gap-2 hover:brightness-105 transition-all cursor-pointer"
        >
          <Scale className="w-4 h-4 text-black" />
          <span className="text-xs font-bold">Compare ({compareList.length}/4)</span>
        </button>
      </div>

      {/* Compare Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-neutral-900 rounded-2xl w-full max-w-5xl overflow-hidden border border-neutral-200 shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scale className="w-6 h-6 text-gold" />
                  <div>
                    <h3 className="font-serif text-lg font-bold">Side-By-Side Product Comparison</h3>
                    <p className="text-xs text-neutral-500">Compare price, category, stock, and rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={clearCompare}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Grid Table */}
              <div className="p-4 sm:p-6 overflow-x-auto">
                <div className="grid grid-cols-5 gap-4 min-w-[700px]">
                  {/* Labels Column */}
                  <div className="space-y-6 pt-24 font-semibold text-xs text-neutral-500">
                    <div>Product Name</div>
                    <div>Price</div>
                    <div>Category</div>
                    <div>Stock</div>
                    <div>Rating</div>
                    <div>Action</div>
                  </div>

                  {/* Compared Items */}
                  {compareList.map((item) => (
                    <div key={item.id} className="space-y-6 text-xs border-l border-neutral-200 pl-4 relative">
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-0 right-0 p-1 text-neutral-400 hover:text-rose-500 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-2">
                        <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-lg mx-auto" />
                        <h4 className="font-serif font-bold text-center line-clamp-2">{item.title}</h4>
                      </div>

                      <div className="font-serif font-bold text-gold text-sm text-center">
                        {formatPrice(item.salePrice != null && item.salePrice < item.price ? item.salePrice : item.price)}
                      </div>

                      <div className="text-center font-medium">{item.category}</div>

                      <div className={`text-center font-semibold ${item.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.stockQuantity > 0 ? `In Stock (${item.stockQuantity})` : 'Out of Stock'}
                      </div>

                      <div className="text-center flex items-center justify-center gap-1 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {item.rating} ({item.reviewCount})
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            addToCart(item);
                            removeFromCompare(item.id);
                          }}
                          className="w-full py-2 rounded-lg bg-gold text-black font-bold text-xs hover:brightness-105 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
