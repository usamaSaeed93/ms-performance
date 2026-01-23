"use client";

import { useState } from "react";
import { useGetProductReviewsQuery, useCreateProductReviewMutation } from "@/lib/store/api/productsApi";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ProductReviewsProps {
  productId: number;
  productName: string;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
}

export default function ProductReviews({
  productId,
  productName,
  isAuthenticated = false,
  userName = "",
  userEmail = ""
}: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    reviewer_name: userName,
    reviewer_email: userEmail,
    title: "",
    review_text: "",
    rating: 5,
    is_verified_purchase: false,
  });

  const { data, isLoading, error, refetch } = useGetProductReviewsQuery({
    product_id: productId,
    page,
    per_page: 10,
    approved_only: true,
  });

  const [createReview, { isLoading: isSubmitting }] = useCreateProductReviewMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview({
        product_id: productId,
        ...formData,
      }).unwrap();

      // Reset form
      setFormData({
        reviewer_name: userName,
        reviewer_email: userEmail,
        title: "",
        review_text: "",
        rating: 5,
        is_verified_purchase: false,
      });
      setShowReviewForm(false);
      refetch();
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
              }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-600">Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className="space-y-6">
      {/* Header with title and button aligned */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0c1b33]">Customer Reviews</h3>
        {!showReviewForm && (
          isAuthenticated ? (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-[#1d70ff] text-white rounded-md hover:bg-[#1560e6] transition"
            >
              Write a Review
            </button>
          ) : (
            <Link
              href="/login?redirect=back"
              className="px-4 py-2 bg-gray-100 text-[#5c6c86] rounded-md hover:bg-gray-200 transition text-sm"
            >
              Log in to write a review
            </Link>
          )
        )}
      </div>

      {/* Review Form - only shown for authenticated users */}
      {showReviewForm && isAuthenticated && (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-[#0c1b33]">Write a Review</h3>

          <div>
            <label className="block text-sm font-medium text-[#0c1b33] mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.reviewer_name}
              onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d70ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c1b33] mb-1">
              Your Email
            </label>
            <input
              type="email"
              value={formData.reviewer_email}
              onChange={(e) => setFormData({ ...formData, reviewer_email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d70ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c1b33] mb-1">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                      } hover:fill-yellow-300 hover:text-yellow-300 transition`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c1b33] mb-1">
              Review Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d70ff]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0c1b33] mb-1">
              Your Review
            </label>
            <textarea
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1d70ff]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verified"
              checked={formData.is_verified_purchase}
              onChange={(e) => setFormData({ ...formData, is_verified_purchase: e.target.checked })}
              className="w-4 h-4 text-[#1d70ff] border-gray-300 rounded focus:ring-[#1d70ff]"
            />
            <label htmlFor="verified" className="text-sm text-[#5c6c86]">
              I purchased this product
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#1d70ff] text-white rounded-md hover:bg-[#1560e6] transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setFormData({
                  reviewer_name: "",
                  reviewer_email: "",
                  title: "",
                  review_text: "",
                  rating: 5,
                  is_verified_purchase: false,
                });
              }}
              className="px-4 py-2 border border-gray-300 text-[#0c1b33] rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#5c6c86]">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#0c1b33]">
                      {review.reviewer_name}
                    </h4>
                    {review.is_verified_purchase && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating, "sm")}
                    <span className="text-xs text-[#5c6c86]">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h5 className="font-medium text-[#0c1b33] mb-1">{review.title}</h5>
                  )}
                  {review.review_text && (
                    <p className="text-sm text-[#5c6c86] leading-relaxed">{review.review_text}</p>
                  )}
                </div>
                {review.helpful_count > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[#5c6c86]">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{review.helpful_count}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-[#5c6c86]">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}











