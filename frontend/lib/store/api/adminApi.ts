import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface Product {
  id: number;
  product_name: string;
  slug?: string | null;
  short_description?: string | null;
  description: string | null;
  category_id: number;
  price: string;
  sale_price?: string | null;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  product_type?: "simple" | "variable" | "grouped" | "external";
  is_virtual?: boolean;
  is_downloadable?: boolean;
  sku: string | null;
  quantity: number;
  stock_status?: "in_stock" | "out_of_stock" | "on_backorder";
  manage_stock?: boolean;
  stock_threshold?: number | null;
  backorders_allowed?: boolean;
  weight: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  shipping_class?: string | null;
  shipping_required?: boolean;
  shipping_taxable?: boolean;
  tax_class_id?: number | null;
  tax_status?: "taxable" | "shipping" | "none";
  image_url: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  status?: "draft" | "published" | "archived";
  is_active: number;
  is_featured?: boolean;
  purchase_note?: string | null;
  enable_reviews?: boolean;
  average_rating?: string | null;
  review_count?: number;
  upsell_ids?: string | null;
  cross_sell_ids?: string | null;
  parent_id?: number | null;
  external_url?: string | null;
  button_text?: string | null;
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

export interface Category {
  id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
}

export interface TaxClass {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaxRate {
  id: number;
  tax_class_id?: number | null;
  name: string;
  country_code: string;
  state_code?: string | null;
  postcode?: string | null;
  city?: string | null;
  rate: string; // Decimal as string, e.g., "0.2000" for 20%
  priority: number;
  compound: boolean;
  shipping: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: number;
  role: string;
  created_at: string;
  last_login: string | null;
}

export interface Sale {
  id: number;
  user_id: number;
  total_amount: string;
  created_at: string;
}

export interface Discount {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: string;
  minimum_order_amount: string | null;
  maximum_discount_amount: string | null;
  usage_limit: number | null;
  usage_count: number;
  per_user_limit: number | null;
  product_id: number | null;
  category_id: number | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number?: string | null;
  total_amount: number | string;
  order_status?: string;
  payment_status?: string;
  created_at: string;
}

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ecommerce/v1`,
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    // Set Content-Type for JSON requests (will be overridden by FormData if needed)
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
});

// Base query with error handling and response transformation
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    if (result.error.status === 401 || result.error.status === 403) {
      // Token expired or invalid - clear it and redirect
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return result;
  }

  // Transform FastAPI response format: { success, message, data } -> data
  if (result.data && typeof result.data === 'object' && 'data' in result.data) {
    const fastApiResponse = result.data as { success?: boolean; data?: any; message?: string };
    if (fastApiResponse.data !== undefined) {
      return { ...result, data: fastApiResponse.data };
    }
  }

  return result;
};

// Create API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Product',
    'Products',
    'Product',
    'ProductImages',
    'Category',
    'Categories',
    'User',
    'Users',
    'Order',
    'Orders',
    'Discount',
    'Discounts',
    'Sales',
    'LowStock',
    'TaxClasses',
    'TaxRates',
  ],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login_user',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        // Handle FastAPI response format: { success, data: { access_token } } or direct { access_token }
        if (response?.data?.access_token) {
          return { access_token: response.data.access_token };
        }
        if (response?.access_token) {
          return { access_token: response.access_token };
        }
        return response;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined' && data?.access_token) {
            localStorage.setItem('admin_token', data.access_token);
          }
        } catch (error) {
          // Handle error
        }
      },
    }),

    // Products
    getProducts: builder.query<
      { products: Product[] },
      { page?: number; per_page?: number; order_by?: string; order?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);

        return `get_products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any) => {
        // baseQueryWithReauth already extracts the 'data' field from FinalResponse
        // So response here should already be { products: [...] }
        // Just ensure we return the expected structure
        if (response && typeof response === 'object') {
          // If response already has products array, return as-is
          if ('products' in response && Array.isArray(response.products)) {
            return { products: response.products };
          }
          // If response is the products array directly (shouldn't happen but handle it)
          if (Array.isArray(response)) {
            return { products: response };
          }
        }
        // Default to empty array if structure is unexpected
        console.warn('Unexpected response structure for getProducts:', response);
        return { products: [] };
      },
      providesTags: ['Products'],
    }),

    getProduct: builder.query<Product, number>({
      query: (id) => `get_product?product_id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product) => ({
        url: 'create_product',
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Products', 'LowStock'],
    }),

    updateProduct: builder.mutation<Product, { productId: number; product: Partial<Product> }>({
      query: ({ productId, product }) => ({
        url: 'update_product',
        method: 'PUT',
        body: { product_id: productId, ...product },
      }),
      invalidatesTags: (result, error, { productId }) => [
        'Products',
        { type: 'Product', id: productId },
        'LowStock',
      ],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (productId) => ({
        url: 'delete_product',
        method: 'POST',
        body: { product_id: productId },
      }),
      invalidatesTags: ['Products', 'LowStock'],
    }),

    getLowStockProducts: builder.query<{ products: Product[] }, number | void>({
      query: (quantity_threshold = 10) =>
        `get_low_stock_products?quantity_threshold=${quantity_threshold}`,
      providesTags: ['LowStock'],
    }),

    addInventory: builder.mutation<void, { product_id: number; quantity: number }>({
      query: (body) => ({
        url: 'add_inventory',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Products', 'LowStock', 'Product'],
    }),

    createProductImages: builder.mutation<
      { images: ProductImage[] },
      { productId: number; images: Array<{ image_url: string; alt_text?: string; sort_order?: number; is_primary?: boolean }> }
    >({
      query: ({ productId, images }) => ({
        url: 'create_product_image',
        method: 'PUT',
        body: { product_id: productId, images },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
      ],
    }),

    getProductImages: builder.query<
      { images: ProductImage[] },
      number
    >({
      query: (productId) => `get_product_images?product_id=${productId}`,
      transformResponse: (response: any) => {
        if (response && typeof response === 'object') {
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
        { type: 'ProductImages', id: productId },
      ],
    }),

    updateProductImages: builder.mutation<
      { images: ProductImage[] },
      { productId: number; images: Array<{ image_url: string; alt_text?: string; sort_order?: number; is_primary?: boolean }> }
    >({
      query: ({ productId, images }) => ({
        url: 'update_product_images',
        method: 'PUT',
        body: { product_id: productId, images },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'ProductImages', id: productId },
        { type: 'Product', id: productId },
      ],
    }),

    // Categories
    getCategories: builder.query<
      { categories: Category[] },
      { page?: number; per_page?: number } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());

        return `get_categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any) => {
        // baseQueryWithReauth already extracts the 'data' field from FinalResponse
        // So response here should already be { categories: [...] }
        // Just ensure we return the expected structure
        if (response && typeof response === 'object') {
          // If response already has categories array, return as-is
          if ('categories' in response && Array.isArray(response.categories)) {
            return { categories: response.categories };
          }
          // If response is the categories array directly (shouldn't happen but handle it)
          if (Array.isArray(response)) {
            return { categories: response };
          }
        }
        // Default to empty array if structure is unexpected
        console.warn('Unexpected response structure for getCategories:', response);
        return { categories: [] };
      },
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<Category, { category_name: string; category_slug: string }>({
      query: (category) => ({
        url: 'create_category',
        method: 'PUT',
        body: category,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<Category, { categoryId: number; category: Partial<Category> }>({
      query: ({ categoryId, category }) => ({
        url: 'update_category',
        method: 'PUT',
        body: { category_id: categoryId, ...category },
      }),
      invalidatesTags: ['Categories'],
    }),

    // Tax Classes
    getTaxClasses: builder.query<
      { tax_classes: TaxClass[] },
      { page?: number; per_page?: number; order_by?: string; order?: string; search?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);
        if (params && params.search) queryParams.append('search', params.search);

        return `get_tax_classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any) => {
        if (response && typeof response === 'object') {
          if ('tax_classes' in response && Array.isArray(response.tax_classes)) {
            return { tax_classes: response.tax_classes };
          }
          if (Array.isArray(response)) {
            return { tax_classes: response };
          }
        }
        console.warn('Unexpected response structure for getTaxClasses:', response);
        return { tax_classes: [] };
      },
      providesTags: ['TaxClasses'],
    }),

    createTaxClass: builder.mutation<TaxClass, { name: string; slug: string; description?: string; is_active?: boolean }>({
      query: (taxClass) => ({
        url: 'create_tax_class',
        method: 'PUT',
        body: taxClass,
      }),
      invalidatesTags: ['TaxClasses'],
    }),

    updateTaxClass: builder.mutation<TaxClass, { id: number; name?: string; slug?: string; description?: string; is_active?: boolean }>({
      query: ({ id, ...taxClass }) => ({
        url: 'update_tax_class',
        method: 'PUT',
        body: { id, ...taxClass },
      }),
      invalidatesTags: ['TaxClasses'],
    }),

    deleteTaxClass: builder.mutation<void, number>({
      query: (id) => ({
        url: 'delete_tax_class',
        method: 'POST',
        body: { id },
      }),
      invalidatesTags: ['TaxClasses'],
    }),

    // Tax Rates
    getTaxRates: builder.query<
      { tax_rates: TaxRate[] },
      { page?: number; per_page?: number; order_by?: string; order?: string; search?: string; tax_class_id?: number; country_code?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);
        if (params && params.search) queryParams.append('search', params.search);
        if (params && params.tax_class_id) queryParams.append('tax_class_id', params.tax_class_id.toString());
        if (params && params.country_code) queryParams.append('country_code', params.country_code);

        return `get_tax_rates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any) => {
        if (response && typeof response === 'object') {
          if ('tax_rates' in response && Array.isArray(response.tax_rates)) {
            return { tax_rates: response.tax_rates };
          }
          if (Array.isArray(response)) {
            return { tax_rates: response };
          }
        }
        console.warn('Unexpected response structure for getTaxRates:', response);
        return { tax_rates: [] };
      },
      providesTags: ['TaxRates'],
    }),

    createTaxRate: builder.mutation<TaxRate, Partial<TaxRate>>({
      query: (taxRate) => ({
        url: 'create_tax_rate',
        method: 'PUT',
        body: taxRate,
      }),
      invalidatesTags: ['TaxRates'],
    }),

    updateTaxRate: builder.mutation<TaxRate, { id: number } & Partial<TaxRate>>({
      query: ({ id, ...taxRate }) => ({
        url: 'update_tax_rate',
        method: 'PUT',
        body: { id, ...taxRate },
      }),
      invalidatesTags: ['TaxRates'],
    }),

    deleteTaxRate: builder.mutation<void, number>({
      query: (id) => ({
        url: 'delete_tax_rate',
        method: 'POST',
        body: { id },
      }),
      invalidatesTags: ['TaxRates'],
    }),

    // Users
    getUsers: builder.query<
      { users: User[] },
      { page?: number; per_page?: number; order_by?: string; order?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);

        return `get_users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation<User, { userId: number; user: Partial<User> }>({
      query: ({ userId, user }) => ({
        url: 'update_user',
        method: 'PUT',
        body: { user_id: userId, ...user },
      }),
      invalidatesTags: ['Users'],
    }),

    // Orders
    getOrders: builder.query<
      { orders: Order[] },
      { page?: number; per_page?: number; order_by?: string; order?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);

        return `get_orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Orders'],
    }),

    updateOrder: builder.mutation<
      Order,
      {
        orderId: number;
        order: {
          order_status?: string;
          payment_status?: string;
          payment_method?: string;
          shipping_address?: string;
          shipping_cost?: number;
          tax?: number;
        };
      }
    >({
      query: ({ orderId, order }) => ({
        url: 'update_order',
        method: 'PUT',
        body: { order_id: orderId, ...order },
      }),
      invalidatesTags: ['Orders'],
    }),

    // Sales
    getSalesData: builder.query<
      { total_revenue: number; sales: Sale[] },
      {
        start_date?: string;
        end_date?: string;
        product_ids?: number[];
        category_ids?: number[];
        buckets?: 'daily' | 'weekly' | 'monthly' | 'yearly';
        include_sales_items?: boolean;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.start_date) queryParams.append('start_date', params.start_date);
        if (params && params.end_date) queryParams.append('end_date', params.end_date);
        if (params && params.buckets) queryParams.append('buckets', params.buckets);
        if (params && params.include_sales_items) queryParams.append('include_sales_items', 'true');

        return `get_sales_data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Sales'],
    }),

    // Discounts
    getDiscounts: builder.query<
      { discounts: Discount[] },
      { page?: number; per_page?: number; order_by?: string; order?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && params.page) queryParams.append('page', params.page.toString());
        if (params && params.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params && params.order_by) queryParams.append('order_by', params.order_by);
        if (params && params.order) queryParams.append('order', params.order);

        return `get_discounts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      providesTags: ['Discounts'],
    }),

    createDiscount: builder.mutation<
      Discount,
      {
        code: string;
        name: string;
        description?: string;
        discount_type: "percentage" | "fixed";
        discount_value: number;
        minimum_order_amount?: number;
        maximum_discount_amount?: number;
        usage_limit?: number;
        per_user_limit?: number;
        product_id?: number;
        category_id?: number;
        valid_from: string;
        valid_until?: string;
        is_active?: boolean;
      }
    >({
      query: (discount) => ({
        url: 'create_discount',
        method: 'PUT',
        body: discount,
      }),
      invalidatesTags: ['Discounts'],
    }),

    // Image Upload
    uploadImage: builder.mutation<
      { url: string; filename: string; size: number; content_type: string },
      { file: File; folder: string }
    >({
      queryFn: async ({ file, folder }, _queryApi, _extraOptions, baseQuery) => {
        const token = typeof window !== 'undefined'
          ? localStorage.getItem('admin_token')
          : null;

        const baseUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ecommerce/v1`;
        const url = `${baseUrl}/upload_image`;

        console.log('[RTK Query] Starting image upload:', {
          filename: file.name,
          size: file.size,
          type: file.type,
          folder,
          url,
        });

        // Validate FormData
        console.log('[RTK Query] Creating FormData...');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        // Verify FormData entries
        console.log('[RTK Query] FormData entries:', {
          hasFile: formData.has('file'),
          hasFolder: formData.has('folder'),
          fileValue: formData.get('file'),
        });

        try {
          const headers: HeadersInit = {};
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('[RTK Query] Token found, length:', token.length);
          } else {
            console.warn('[RTK Query] No token found!');
          }
          // Don't set Content-Type - browser will set it with boundary for FormData

          console.log('[RTK Query] Making fetch request with timeout...', {
            url,
            method: 'POST',
            hasToken: !!token,
            fileSize: file.size,
            fileType: file.type,
            folder,
            headers: Object.keys(headers),
          });

          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.error('[RTK Query] Upload timeout after 30 seconds - aborting');
            controller.abort();
          }, 30000); // 30 second timeout for faster debugging

          const startTime = Date.now();
          console.log('[RTK Query] Fetch start time:', startTime);

          let response: Response;
          try {
            console.log('[RTK Query] About to call fetch() with:', {
              url,
              method: 'POST',
              hasBody: !!formData,
              hasSignal: !!controller.signal,
              headersCount: Object.keys(headers).length,
            });

            const fetchPromise = fetch(url, {
              method: 'POST',
              headers,
              body: formData,
              signal: controller.signal,
            });

            console.log('[RTK Query] Fetch promise created at', Date.now(), '- waiting for response...');

            // Add a check after 1 second to see if it's still pending
            setTimeout(() => {
              console.warn('[RTK Query] Fetch still pending after 1 second...');
            }, 1000);

            response = await fetchPromise;
            const elapsed = Date.now() - startTime;
            console.log('[RTK Query] Fetch completed in', elapsed, 'ms');
            clearTimeout(timeoutId);
          } catch (fetchError: any) {
            clearTimeout(timeoutId);
            const elapsed = Date.now() - startTime;
            console.error('[RTK Query] Fetch error after', elapsed, 'ms:', {
              name: fetchError.name,
              message: fetchError.message,
              stack: fetchError.stack,
            });

            if (fetchError.name === 'AbortError') {
              console.error('[RTK Query] Upload aborted due to timeout');
              return {
                error: {
                  status: 'TIMEOUT_ERROR' as const,
                  error: 'Upload timeout - request took too long',
                },
              };
            }
            throw fetchError;
          }

          const headersObj: Record<string, string> = {};
          if (response.headers) {
            response.headers.forEach((value, key) => {
              headersObj[key] = value;
            });
          }
          console.log('[RTK Query] Response received:', {
            status: response.status,
            statusText: response.statusText,
            headers: headersObj,
          });

          if (!response.ok) {
            console.error('[RTK Query] Response not OK:', response.status, response.statusText);
            let errorText: string;
            let errorData: any;

            try {
              errorText = await response.text();
              console.error('[RTK Query] Upload error response text:', errorText);
              try {
                errorData = JSON.parse(errorText);
                console.error('[RTK Query] Upload error response parsed:', errorData);
              } catch {
                errorData = { message: errorText || `HTTP ${response.status}` };
              }
            } catch (textError) {
              console.error('[RTK Query] Failed to read error response:', textError);
              errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
            }

            return {
              error: {
                status: response.status,
                data: errorData,
              },
            };
          }

          console.log('[RTK Query] Reading response JSON...');
          let data: any;
          try {
            const responseText = await response.text();
            console.log('[RTK Query] Response text:', responseText.substring(0, 500)); // Log first 500 chars
            data = JSON.parse(responseText);
            console.log('[RTK Query] Upload response data parsed:', data);
          } catch (parseError) {
            console.error('[RTK Query] Failed to parse response:', parseError);
            return {
              error: {
                status: 'CUSTOM_ERROR' as const,
                error: 'Failed to parse server response',
              },
            };
          }

          // Handle FastAPI response format: { success, data, message }
          if (data?.success && data?.data) {
            console.log('[RTK Query] Upload successful:', data.data);
            return { data: data.data };
          }

          if (data?.data) {
            return { data: data.data };
          }

          return { data };
        } catch (error: any) {
          console.error('[RTK Query] Upload exception:', error);
          return {
            error: {
              status: 'FETCH_ERROR',
              error: error.message || 'Network error',
            },
          };
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth
  useLoginMutation,

  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetLowStockProductsQuery,
  useAddInventoryMutation,
  useCreateProductImagesMutation,
  useGetProductImagesQuery,
  useUpdateProductImagesMutation,

  // Categories
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,

  // Users
  useGetUsersQuery,
  useUpdateUserMutation,

  // Orders
  useGetOrdersQuery,
  useUpdateOrderMutation,

  // Sales
  useGetSalesDataQuery,

  // Discounts
  useGetDiscountsQuery,
  useCreateDiscountMutation,

  // Tax Classes
  useGetTaxClassesQuery,
  useCreateTaxClassMutation,
  useUpdateTaxClassMutation,
  useDeleteTaxClassMutation,

  // Tax Rates
  useGetTaxRatesQuery,
  useCreateTaxRateMutation,
  useUpdateTaxRateMutation,
  useDeleteTaxRateMutation,

  // Image Upload
  useUploadImageMutation,

  // Utilities
  useLazyGetProductsQuery,
  useLazyGetProductQuery,
  useLazyGetCategoriesQuery,
  useLazyGetUsersQuery,
  useLazyGetOrdersQuery,
  useLazyGetSalesDataQuery,
  useLazyGetDiscountsQuery,
  useLazyGetLowStockProductsQuery,
} = adminApi;

