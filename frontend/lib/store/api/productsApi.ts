import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export interface ProductVariant {
  id: number;
  product_id: number;
  sku?: string | null;
  name?: string | null;
  price?: string | null;
  sale_price?: string | null;
  quantity: number;
  stock_status: "in_stock" | "out_of_stock" | "on_backorder";
  manage_stock: boolean;
  stock_threshold?: number | null;
  weight?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  product_name: string;
  slug?: string | null;
  description: string | null;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  price: string;
  sale_price?: string | null;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  product_type?: "simple" | "variable" | "grouped" | "external";
  sku: string | null;
  quantity: number;
  image_url: string | null;
  is_active: number;
  is_featured?: boolean;
  average_rating?: string | null;
  review_count?: number;
  weight?: string | null;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data?: {
    products: Product[];
    total?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
  products?: Product[];
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface GetProductsParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: 'asc' | 'desc';
  category_ids?: number[];
  search?: string;
}

export interface Category {
  id: number;
  category_name: string;
  category_slug: string;
  description?: string | null;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id?: number | null;
  reviewer_name: string;
  reviewer_email?: string | null;
  title?: string | null;
  review_text?: string | null;
  rating: number;
  is_approved: boolean;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface GetProductReviewsParams {
  product_id: number;
  page?: number;
  per_page?: number;
  approved_only?: boolean;
}

export interface ProductReviewsResponse {
  reviews: ProductReview[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateProductReviewParams {
  product_id: number;
  reviewer_name: string;
  reviewer_email?: string;
  title?: string;
  review_text?: string;
  rating: number;
  is_verified_purchase?: boolean;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ecommerce/v1`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('admin_token') 
      : null;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
    if (result.error.status === 403) {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('admin_token') 
        : null;
      
      if (!token) {
        console.warn('Products endpoint requires authentication. Please ensure backend allows public access or user is logged in.');
      }
    }
    return result;
  }

  if (result.data && typeof result.data === 'object' && 'data' in result.data) {
    const fastApiResponse = result.data as { success?: boolean; data?: any; message?: string };
    if (fastApiResponse.data !== undefined) {
      return { ...result, data: fastApiResponse.data };
    }
  }
  
  return result;
};

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Products', 'Product', 'ProductReviews'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.order_by) queryParams.append('order_by', params.order_by);
        if (params?.order) queryParams.append('order', params.order);
        if (params?.category_ids && params.category_ids.length > 0) {
          params.category_ids.forEach(id => queryParams.append('category_ids', id.toString()));
        }
        if (params?.search) {
          queryParams.append('search', params.search);
        }
        
        return `get_products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any): ProductsResponse => {
        if (response && typeof response === 'object') {
          // If response has nested data.data structure (already extracted by baseQueryWithErrorHandling)
          if ('data' in response && response.data) {
            const data = response.data;
            if ('products' in data && Array.isArray(data.products)) {
              return {
                products: data.products,
                total: data.total,
                page: data.page,
                per_page: data.per_page,
                total_pages: data.total_pages,
              };
            }
          }
          // If response already has products at top level (after baseQueryWithErrorHandling extraction)
          if ('products' in response && Array.isArray(response.products)) {
            return {
              products: response.products,
              total: response.total,
              page: response.page,
              per_page: response.per_page,
              total_pages: response.total_pages,
            };
          }
          if (Array.isArray(response)) {
            return { products: response };
          }
        }
        return { products: [] };
      },
      providesTags: ['Products'],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `get_product?product_id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      transformResponse: (response: any): Product => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response;
        }
        throw new Error('Invalid response format');
      },
    }),

    getProductImages: builder.query<{ images: ProductImage[] }, number>({
      query: (productId) => `get_product_images?product_id=${productId}`,
      transformResponse: (response: any): { images: ProductImage[] } => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            if ('images' in response.data && Array.isArray(response.data.images)) {
              return { images: response.data.images };
            }
          }
          if ('images' in response && Array.isArray(response.images)) {
            return { images: response.images };
          }
          if (Array.isArray(response)) {
            return { images: response };
          }
        }
        return { images: [] };
      },
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
    }),

    getCategories: builder.query<CategoriesResponse, { page?: number; per_page?: number; search?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.search) queryParams.append('search', params.search);
        
        return `get_categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any): CategoriesResponse => {
        // baseQueryWithErrorHandling already extracts the 'data' field from FinalResponse
        // So response here should already be { categories: [...] }
        if (response && typeof response === 'object') {
          // If response already has categories array, return as-is
          if ('categories' in response && Array.isArray(response.categories)) {
            return { categories: response.categories };
          }
          // If response is the categories array directly (shouldn't happen but handle it)
          if (Array.isArray(response)) {
            return { categories: response };
          }
          // Check nested data structure (if baseQuery didn't extract it)
          if ('data' in response && response.data) {
            const data = response.data;
            if ('categories' in data && Array.isArray(data.categories)) {
              return { categories: data.categories };
            }
          }
        }
        // Default to empty array if structure is unexpected
        console.warn('Unexpected response structure for getCategories:', response);
        return { categories: [] };
      },
      providesTags: ['Products'],
    }),

    getProductReviews: builder.query<ProductReviewsResponse, GetProductReviewsParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('product_id', params.product_id.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params.approved_only !== undefined) queryParams.append('approved_only', params.approved_only.toString());
        
        return `get_product_reviews?${queryParams.toString()}`;
      },
      transformResponse: (response: any): ProductReviewsResponse => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            const data = response.data;
            if ('reviews' in data && Array.isArray(data.reviews)) {
              return {
                reviews: data.reviews,
                total: data.total || 0,
                page: data.page || 1,
                per_page: data.per_page || 10,
                total_pages: data.total_pages || 0,
              };
            }
          }
          if ('reviews' in response && Array.isArray(response.reviews)) {
            return {
              reviews: response.reviews,
              total: response.total || 0,
              page: response.page || 1,
              per_page: response.per_page || 10,
              total_pages: response.total_pages || 0,
            };
          }
        }
        return { reviews: [], total: 0, page: 1, per_page: 10, total_pages: 0 };
      },
      providesTags: (result, error, params) => [
        { type: 'ProductReviews', id: params.product_id },
        { type: 'Product', id: params.product_id },
      ],
    }),

    createProductReview: builder.mutation<{ review: ProductReview }, CreateProductReviewParams>({
      query: (body) => ({
        url: 'create_product_review',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: any): { review: ProductReview } => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            if ('review' in response.data) {
              return { review: response.data.review };
            }
          }
          if ('review' in response) {
            return { review: response.review };
          }
        }
        throw new Error('Invalid response format');
      },
      invalidatesTags: (result, error, params) => [
        { type: 'ProductReviews', id: params.product_id },
        { type: 'Product', id: params.product_id },
        'Products',
      ],
    }),

    updateProductReview: builder.mutation<
      { review: ProductReview },
      { review_id: number; is_approved?: boolean; helpful_count?: number }
    >({
      query: (body) => ({
        url: 'update_product_review',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: any): { review: ProductReview } => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            if ('review' in response.data) {
              return { review: response.data.review };
            }
          }
          if ('review' in response) {
            return { review: response.review };
          }
        }
        throw new Error('Invalid response format');
      },
      invalidatesTags: (result, error, params) => [
        'ProductReviews',
        'Products',
      ],
    }),

    deleteProductReview: builder.mutation<void, number>({
      query: (review_id) => ({
        url: 'delete_product_review',
        method: 'DELETE',
        body: { review_id },
      }),
      invalidatesTags: ['ProductReviews', 'Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductImagesQuery,
  useGetCategoriesQuery,
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useUpdateProductReviewMutation,
  useDeleteProductReviewMutation,
} = productsApi;

