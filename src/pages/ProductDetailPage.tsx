import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchProductById, fetchProductReviews, submitProductReview } from '../services/api';
import { Product, Review } from '../types';
import {
  Heart,
  ShoppingBag,
  Scale,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    formatPrice,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    wishlist,
    addToCompare,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ reviewerName: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const handleHash = async () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        setLoading(true);
        const data = await fetchProductById(id);
        setProduct(data);
        if (data?.images?.[0]) setSelectedImage(data.images[0]);
        if (data?.id) {
          const reviewData = await fetchProductReviews(data.id);
          setReviews(reviewData);
        }
        setLoading(false);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSubmitReview = async () => {
    if (!product || !reviewForm.reviewerName.trim() || !reviewForm.comment.trim()) {
      useStore.getState().showToast('Please enter your name and a comment', 'error');
      return;
    }
    setSubmittingReview(true);
    const result = await submitProductReview({
      productId: product.id,
      reviewerName: reviewForm.reviewerName.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });
    setSubmittingReview(false);
    if (result.success) {
      useStore.getState().showToast('Thank you! Your review will appear once approved.', 'success');
      setReviewForm({ reviewerName: '', rating: 5, comment: '' });
    } else {
      useStore.getState().showToast(result.message || 'Failed to submit review', 'error');
    }
  };

  if (loading || !product) {
    return (
      <div className="py-24 text-center text-gold-light space-y-3">
        <div className="w-8 h-8 border-2 border-gold-light border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-serif font-bold">Loading Product...</p>
      </div>
    );
  }

  const isWishlisted = wishlist.some((w) => w.id === product.id);
  const hasSale = product.salePrice != null && product.salePrice < product.price;
  const inStock = product.stockQuantity > 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-10 space-y-6 sm:space-y-12 pb-24 sm:pb-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
        <a href="#" className="hover:underline shrink-0">Home</a>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <a href="#shop" className="hover:underline shrink-0">Shop</a>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-neutral-900 font-bold truncate">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-cream border border-neutral-200 aspect-square shadow-xs group">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Thumbnails Carousel */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  selectedImage === img ? 'border-gold scale-105 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-1.5 border-b border-neutral-200 pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gold">
                {product.category}{product.sku ? ` • SKU: ${product.sku}` : ''}
              </span>

              <button
                onClick={() => (isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product))}
                className={`p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'border-neutral-300 text-neutral-600 hover:text-rose-600'
                }`}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <h1 className="font-serif text-lg sm:text-2xl font-extrabold text-neutral-900 uppercase leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-neutral-500">
              <div className="flex items-center text-amber-400 gap-1 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating || 4.9}</span>
              </div>
              <span>({product.reviewCount || reviews.length} Reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2 bg-cream p-3.5 sm:p-4 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-[10px] sm:text-xs text-neutral-500 block">Price</span>
              <span className="font-serif text-xl sm:text-3xl font-bold text-gold">
                {formatPrice(hasSale ? (product.salePrice as number) : product.price)}
              </span>
              {hasSale && (
                <span className="text-[11px] sm:text-xs text-neutral-400 line-through ml-2 font-mono">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-600">
                <XCircle className="w-4 h-4" /> Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="font-bold text-neutral-900 uppercase text-[10px] tracking-wider block">
              Description
            </span>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 py-3.5 rounded-xl bg-gold text-black font-extrabold text-xs uppercase tracking-wider shadow-md hover:brightness-105 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" /> {inStock ? 'Add To Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={() => addToCompare(product)}
              className="px-4 py-3.5 rounded-xl bg-neutral-100 text-neutral-900 font-semibold text-xs border border-neutral-300 hover:border-gold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Scale className="w-4 h-4 text-gold" /> Compare
            </button>
          </div>

          {/* Mobile Fixed Bottom CTA Bar for Smooth UX */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 flex items-center justify-between gap-3 shadow-xl">
            <div className="min-w-0">
              <span className="text-[9px] text-neutral-500 uppercase block">Price</span>
              <span className="font-serif font-extrabold text-sm text-gold truncate block">
                {formatPrice(hasSale ? (product.salePrice as number) : product.price)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" /> {inStock ? 'Add To Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-neutral-200 text-[10px] sm:text-[11px] text-center text-neutral-600">
            <div className="space-y-0.5">
              <ShieldCheck className="w-4 h-4 text-gold mx-auto" />
              <span className="block leading-tight">Genuine Products</span>
            </div>
            <div className="space-y-0.5">
              <Truck className="w-4 h-4 text-gold mx-auto" />
              <span className="block leading-tight">Free Shipping</span>
            </div>
            <div className="space-y-0.5">
              <RotateCcw className="w-4 h-4 text-gold mx-auto" />
              <span className="block leading-tight">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 pt-6 border-t border-neutral-200">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-xs text-neutral-500">No reviews yet. Be the first to review this product.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-2 shadow-xs">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-600 italic leading-relaxed">"{rev.comment}"</p>
                <p className="text-[11px] font-semibold text-neutral-900">{rev.reviewerName}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review */}
        <div className="bg-cream border border-neutral-200 rounded-2xl p-4 sm:p-5 space-y-3 max-w-lg">
          <h3 className="font-serif text-sm font-bold text-neutral-900">Write a Review</h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                className="cursor-pointer"
              >
                <Star className={`w-5 h-5 ${star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Your name"
            value={reviewForm.reviewerName}
            onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold"
          />
          <textarea
            placeholder="Share your experience with this product..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            rows={3}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold resize-none"
          />
          <button
            onClick={handleSubmitReview}
            disabled={submittingReview}
            className="px-4 py-2 bg-gold text-black font-bold text-xs rounded-lg hover:brightness-105 cursor-pointer disabled:opacity-60"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};
