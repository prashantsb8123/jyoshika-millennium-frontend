import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Gift, Tag, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateCoupon } from '../../services/api';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, formatPrice, user } = useStore();
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [applyingCoupon, setApplyingCoupon] = useState<boolean>(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.salePrice != null && item.product.salePrice < item.product.price
      ? item.product.salePrice
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);
  const gstTax = Math.round(subtotal * 0.03);
  const total = Math.max(0, subtotal + gstTax - discountVal);

  const freeGiftThreshold = 2000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeGiftThreshold) * 100));

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    const result = await validateCoupon(couponCode.trim().toUpperCase(), subtotal);
    setApplyingCoupon(false);
    if (result.valid) {
      setDiscountVal(result.discountAmount || 0);
      setAppliedCoupon(`${couponCode.trim().toUpperCase()} (-${formatPrice(result.discountAmount || 0)})`);
    } else {
      setDiscountVal(0);
      setAppliedCoupon(null);
      useStore.getState().showToast(result.message || 'Invalid coupon code', 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white text-neutral-900 shadow-2xl border-l border-neutral-200 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h3 className="font-serif text-lg font-bold">Shopping Bag ({cart.length})</h3>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Gift Progress Bar */}
            <div className="bg-cream p-3 px-5 border-b border-neutral-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-medium text-gold">
                  <Gift className="w-4 h-4 text-gold" />
                  {subtotal >= freeGiftThreshold ? 'Free Gift Unlocked!' : 'Add items to unlock a free gift'}
                </span>
                <span className="font-mono text-neutral-500">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-neutral-100">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
                  <p className="font-serif text-base font-semibold text-neutral-600">Your shopping bag is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-2 text-xs text-gold font-semibold underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const unitPrice = item.product.salePrice != null && item.product.salePrice < item.product.price
                    ? item.product.salePrice
                    : item.product.price;
                  return (
                  <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg border border-neutral-200"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xs font-semibold line-clamp-2">{item.product.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-neutral-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 flex gap-2">
                        <span>{item.product.category}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-neutral-600 hover:bg-neutral-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-serif text-sm font-bold text-gold">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-5 bg-cream border-t border-neutral-200 space-y-4">
                {/* Coupon Code Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SAVE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono uppercase focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="px-3 py-1.5 bg-gold text-black font-bold text-xs rounded-lg hover:brightness-105 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="text-xs text-emerald-700 font-medium flex items-center justify-between bg-emerald-50 p-2 rounded border border-emerald-200">
                    <span>Applied: {appliedCoupon}</span>
                    <button onClick={() => { setAppliedCoupon(null); setDiscountVal(0); }} className="text-rose-500 underline">Remove</button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated 3% GST:</span>
                    <span className="font-mono text-neutral-900">{formatPrice(gstTax)}</span>
                  </div>
                  {discountVal > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatPrice(discountVal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total Amount:</span>
                    <span className="font-serif text-gold">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    window.location.hash = '#checkout';
                  }}
                  className="w-full py-3.5 rounded-xl bg-gold text-black font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  Proceed To Secure Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Secure Checkout & Easy Returns
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
