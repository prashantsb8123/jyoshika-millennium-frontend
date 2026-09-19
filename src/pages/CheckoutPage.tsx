import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { placeOrder, verifyRazorpayPayment } from '../services/api';
import { PaymentMethod, ShippingAddress } from '../types';
import { ShieldCheck, Truck, Lock, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, formatPrice, user, token, showToast } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [address, setAddress] = useState<ShippingAddress>({
    addressLine1: 'Taj Suite #102, Apollo Bunder',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  });
  const [phone, setPhone] = useState<string>('9820011223');
  const [loading, setLoading] = useState<boolean>(false);

  const subtotal = cart.reduce((acc, item) => {
    const unitPrice = item.product.salePrice != null && item.product.salePrice < item.product.price
      ? item.product.salePrice
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);
  const gstTax = Math.round(subtotal * 0.03);
  const total = subtotal + gstTax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }
    if (!fullName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setLoading(true);

    const orderPayload = {
      customerName: fullName,
      customerEmail: email || undefined,
      customerPhone: phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      paymentMethod,
      items: cart.map((c) => ({
        productId: c.product.id,
        quantity: c.quantity,
      })),
    };

    const result = await placeOrder(orderPayload, token || undefined);

    if (!result.success || !result.data) {
      setLoading(false);
      showToast(result.message || 'Order processing failed', 'error');
      return;
    }

    const order = result.data;

    if (paymentMethod !== 'RAZORPAY') {
      setLoading(false);
      clearCart();
      showToast('Order placed successfully!', 'success');
      window.location.hash = `#order-success-${order.id}`;
      return;
    }

    if (!order.razorpayOrderId || !order.razorpayKeyId || typeof (window as any).Razorpay === 'undefined') {
      setLoading(false);
      showToast('Online payment is temporarily unavailable right now. Please choose Cash on Delivery or try again shortly.', 'error');
      return;
    }

    const razorpayCheckout = new (window as any).Razorpay({
      key: order.razorpayKeyId,
      amount: Math.round(total * 100),
      currency: 'INR',
      name: 'Jyoshika Millennium',
      description: `Order ${order.orderNumber}`,
      order_id: order.razorpayOrderId,
      prefill: {
        name: fullName,
        email: email || undefined,
        contact: phone,
      },
      theme: { color: '#B8860B' },
      handler: async (response: any) => {
        const verify = await verifyRazorpayPayment(
          order.id,
          {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
          token || undefined
        );
        setLoading(false);
        if (verify.success) {
          clearCart();
          showToast('Payment successful! Order confirmed.', 'success');
          window.location.hash = `#order-success-${order.id}`;
        } else {
          showToast(verify.message || 'Payment verification failed. Please contact support.', 'error');
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          showToast('Payment cancelled', 'info');
        },
      },
    });

    razorpayCheckout.open();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-gold-light mx-auto" />
        <h2 className="font-serif text-2xl font-bold">Your Bag is Empty</h2>
        <a
          href="#shop"
          className="inline-block px-6 py-3 bg-gold text-black font-bold text-xs uppercase rounded-xl"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2 border-b border-neutral-200 pb-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-gold">
          256-Bit SSL Encrypted Vault Checkout
        </span>
        <h1 className="font-serif text-3xl font-extrabold text-neutral-900 uppercase">
          Insured Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
        {/* Shipping & Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gold uppercase border-b border-neutral-200 pb-2">
              1. Delivery Address (Armored BlueDart Transit)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-700 mb-1 font-semibold">Street / Suite Address</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">State</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Pin Code</label>
                <input
                  type="text"
                  required
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1 font-semibold">Mobile Phone (For OTP Verification)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2.5 text-neutral-900 focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gold uppercase border-b border-neutral-200 pb-2">
              2. Choose Insured Payment Gateway
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'RAZORPAY', name: 'Razorpay (UPI / Cards / NetBanking)' },
                { id: 'COD', name: 'Cash on Delivery' }
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    paymentMethod === pm.id
                      ? 'border-gold bg-amber-50 font-bold shadow-xs'
                      : 'border-neutral-300 opacity-60'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-gold mb-2" />
                  <span className="text-neutral-900">{pm.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="font-serif font-bold text-base text-neutral-900 uppercase border-b border-neutral-200 pb-2">
            Order Summary
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-neutral-100">
            {cart.map((item, i) => {
              const unitPrice = item.product.salePrice != null && item.product.salePrice < item.product.price
                ? item.product.salePrice
                : item.product.price;
              return (
                <div key={i} className="pt-2 first:pt-0 flex gap-3">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h5 className="font-serif font-bold text-neutral-900 line-clamp-1">{item.product.title}</h5>
                    <span className="text-[10px] text-neutral-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-serif font-bold text-gold">{formatPrice(unitPrice * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-neutral-200 font-mono">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>3% GST Tax:</span>
              <span>{formatPrice(gstTax)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200 font-serif">
              <span>Total Payable:</span>
              <span className="text-gold">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gold text-black font-extrabold text-xs uppercase shadow-xl hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? 'Processing Armored Escrow...' : 'Complete Insured Order'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
