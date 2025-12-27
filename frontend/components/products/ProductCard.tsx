"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/lib/store/api/productsApi";
import { useGetProductImagesQuery } from "@/lib/store/api/productsApi";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [shouldFetchImages, setShouldFetchImages] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const { data: imagesData } = useGetProductImagesQuery(product.id, {
    skip: !product.id || !shouldFetchImages,
  });

  const images = imagesData?.images || [];
  const sortedImages = images.length > 0
    ? [...images].sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const primaryImage = product.image_url || "/images/products/product1.png";
  const displayImages = sortedImages.length > 0
    ? sortedImages.map(img => img.image_url)
    : [primaryImage];

  const currentImage = displayImages[currentImageIndex] || displayImages[0];

  const price = parseFloat(product.price);
  const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
  const displayPrice = salePrice || price;
  const oldPrice = salePrice ? price : null;

  const discount = salePrice && price > salePrice
    ? Math.round(((price - salePrice) / price) * 100)
    : null;

  const animationClass = index === 0
    ? 'animate-card'
    : index === 1
      ? 'animate-card-delay-1'
      : index === 2
        ? 'animate-card-delay-2'
        : 'animate-card-delay-3';

  const nextImage = () => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setImageLoading(true);
    setImageError(false);
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={`relative flex flex-col gap-3 rounded-2xl bg-white p-4 sm:p-5 shadow-[0_10px_40px_rgba(16,53,106,0.05)] hover:shadow-[0_15px_50px_rgba(16,53,106,0.1)] transition-all duration-300 cursor-pointer card-hover ${animationClass} flex-shrink-0`}
    >

      <div
        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 group aspect-square"
        onMouseEnter={() => setShouldFetchImages(true)}
      >
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#1d70ff]/20 border-t-[#1d70ff] rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={currentImage}
          alt={product.product_name}
          width={400}
          height={400}
          className={`h-full w-full object-contain p-3 transition-all duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          priority={index < 4}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded-full p-2 z-10"
              aria-label="Previous image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded-full p-2 z-10"
              aria-label="Next image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                    }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="space-y-2 flex-1 flex flex-col font-[var(--font-montserrat)]">
        {/* Product Name */}
        <h3 className="text-base font-bold leading-tight text-[#1a1a1a] line-clamp-2 min-h-[2.75rem]">
          {product.product_name}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, idx) => {
              const rating = product.average_rating ? parseFloat(product.average_rating) : 0;
              const filled = idx < Math.floor(rating);
              const halfFilled = idx === Math.floor(rating) && rating % 1 >= 0.5;
              return (
                <span
                  key={idx}
                  className={`text-base ${filled
                    ? "text-[#ffc107]"
                    : halfFilled
                      ? "text-[#ffc107]"
                      : "text-[#e0e0e0]"
                    }`}
                >
                  ★
                </span>
              );
            })}
          </div>
          <span className="text-sm text-[#888888]">
            {product.average_rating ? parseFloat(product.average_rating).toFixed(1) : "0.0"}/5
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2.5 mt-auto pt-1">
          <span className="text-xl font-bold text-[#1a1a1a]">
            £{displayPrice.toFixed(0)}
          </span>
          {oldPrice && (
            <span className="text-base text-[#b0b0b0] line-through italic">
              £{oldPrice.toFixed(0)}
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-[#ffe0e6] px-2.5 py-0.5 text-xs font-semibold text-[#ff3b69]">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

