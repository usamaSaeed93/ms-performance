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
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={`relative flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(16,53,106,0.05)] hover:shadow-[0_15px_50px_rgba(16,53,106,0.1)] transition-shadow cursor-pointer card-hover ${animationClass}`}
    >
      {discount && (
        <div className="absolute right-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
          -{discount}%
        </div>
      )}
      
      <div 
        className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square group"
        onMouseEnter={() => setShouldFetchImages(true)}
      >
        <Image
          src={currentImage}
          alt={product.product_name}
          width={320}
          height={320}
          className="h-full w-full object-cover animate-image-hover"
        />
        
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
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
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
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category_name || "MS"}
          </span>
        </div>
        <h3 className="text-base font-semibold leading-tight text-[#0c1b33] line-clamp-2">
          {product.product_name}
        </h3>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} className="text-lg text-yellow-400">★</span>
          ))}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#0c1b33]">
            £{displayPrice.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-sm text-[#9aa6bd] line-through">
              £{oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

