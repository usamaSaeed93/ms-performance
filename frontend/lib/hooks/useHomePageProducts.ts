"use client";

import { useMemo } from 'react';
import { useGetProductsQuery } from '@/lib/store/api/productsApi';

export type HomePageProductStrategy = 'featured' | 'newest' | 'mixed' | 'onsale';

interface UseHomePageProductsOptions {
  strategy?: HomePageProductStrategy;
  limit?: number;
  categoryIds?: number[];
}

export function useHomePageProducts(options: UseHomePageProductsOptions = {}) {
  const { strategy = 'mixed', limit = 8, categoryIds } = options;

  const { data: productsData, isLoading } = useGetProductsQuery({
    per_page: limit * 3,
    order_by: 'created_at',
    order: 'desc',
    category_ids: categoryIds,
  });

  const products = useMemo(() => {
    if (!productsData?.products) return [];

    const allProducts = productsData.products;

    if (strategy === 'mixed') {
      const featured = allProducts.filter(p => p.is_featured).slice(0, limit);
      const remaining = limit - featured.length;
      const newest = allProducts.filter(p => !p.is_featured && !featured.find(f => f.id === p.id)).slice(0, remaining);
      return [...featured, ...newest];
    }
    
    if (strategy === 'featured') {
      return allProducts.filter(p => p.is_featured).slice(0, limit);
    }
    
    if (strategy === 'newest') {
      return allProducts.slice(0, limit);
    }

    if (strategy === 'onsale') {
      return allProducts.filter(p => p.sale_price && parseFloat(p.sale_price) > 0).slice(0, limit);
    }

    return [];
  }, [strategy, productsData, limit]);

  return {
    products,
    isLoading,
  };
}

