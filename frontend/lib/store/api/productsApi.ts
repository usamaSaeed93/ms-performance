import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

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
  sku: string | null;
  quantity: number;
  image_url: string | null;
  is_active: number;
  is_featured?: boolean;
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
  products: Product[];
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
  tagTypes: ['Products', 'Product'],
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
        
        return `get_products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any): ProductsResponse => {
        if (response && typeof response === 'object') {
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
          if ('products' in response && Array.isArray(response.products)) {
            return {
              products: response.products,
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductImagesQuery,
} = productsApi;

