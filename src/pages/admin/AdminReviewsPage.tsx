import React, { useEffect, useState } from 'react';
import { MessageSquare, Star, CheckCircle2, Trash2, Check, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { fetchAdminReviews, approveAdminReview, deleteAdminReview } from '../../services/api';
import { Review } from '../../types';

export const AdminReviewsPage: React.FC = () => {
  const { token, showToast } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchAdminReviews(token);
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleDeleteReview = async (id: string) => {
    if (!token) return;
    const result = await deleteAdminReview(id, token);
    if (result.success) {
      showToast('Review deleted', 'success');
      load();
    } else {
      showToast('Failed to delete review', 'error');
    }
  };

  const handleApproveToggle = async (id: string) => {
    if (!token) return;
    const result = await approveAdminReview(id, token);
    if (result.success) {
      load();
    } else {
      showToast('Failed to update review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-xs">
        <div>
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-gold" /> Customer Reviews Moderation
          </h2>
          <p className="text-xs text-neutral-500">Approve or remove customer product feedback and ratings.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-neutral-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-10 text-center text-xs text-neutral-500">
          No reviews have been submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-3 text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                {rev.productTitle && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{rev.productTitle}</p>
                )}
                <p className="text-neutral-600 leading-relaxed">{rev.comment}</p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-800">{rev.reviewerName}</span>
                  {rev.isApproved ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveToggle(rev.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      rev.isApproved
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Toggle Approval Status"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
