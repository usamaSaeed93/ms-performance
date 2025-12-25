import { apiClient } from './client';

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

export interface ProductTag {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  category_name: string;
  category_slug: string;
  created_at: string;
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

export const adminApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{ access_token: string }>('login_user', credentials);
    apiClient.setToken(response.access_token);
    return response;
  },

  async getProducts(params?: { page?: number; per_page?: number; order_by?: string; order?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.order_by) query.append('order_by', params.order_by);
    if (params?.order) query.append('order', params.order);
    
    const endpoint = `get_products${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<{ products: Product[] }>(endpoint);
  },

  async getProduct(id: number) {
    return apiClient.get<Product>(`get_product?product_id=${id}`);
  },

  async createProduct(product: Partial<Product>) {
    return apiClient.put<Product>('create_product', product);
  },

  async getCategories(params?: { page?: number; per_page?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    
    const endpoint = `get_categories${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<{ categories: Category[] }>(endpoint);
  },

  async createCategory(category: { category_name: string; category_slug: string }) {
    return apiClient.put<Category>('create_category', category);
  },

  async getUsers(params?: { page?: number; per_page?: number; order_by?: string; order?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.order_by) query.append('order_by', params.order_by);
    if (params?.order) query.append('order', params.order);
    
    const endpoint = `get_users${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<{ users: User[] }>(endpoint);
  },

  async getSalesData(params?: {
    start_date?: string;
    end_date?: string;
    product_ids?: number[];
    category_ids?: number[];
    buckets?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    include_sales_items?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.start_date) query.append('start_date', params.start_date);
    if (params?.end_date) query.append('end_date', params.end_date);
    if (params?.buckets) query.append('buckets', params.buckets);
    if (params?.include_sales_items) query.append('include_sales_items', 'true');
    
    const endpoint = `get_sales_data${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get(endpoint);
  },

  async getLowStockProducts(quantity_threshold: number = 10) {
    return apiClient.get<{ products: Product[] }>(`get_low_stock_products?quantity_threshold=${quantity_threshold}`);
  },

  async addInventory(product_id: number, quantity: number) {
    return apiClient.put('add_inventory', { product_id, quantity });
  },

  async updateProduct(productId: number, product: Partial<Product>) {
    return apiClient.put<Product>('update_product', { product_id: productId, ...product });
  },

  async deleteProduct(productId: number) {
    return apiClient.post('delete_product', { product_id: productId });
  },

  async updateCategory(categoryId: number, category: Partial<Category>) {
    return apiClient.put<Category>('update_category', { category_id: categoryId, ...category });
  },

  async updateUser(userId: number, user: Partial<User>) {
    return apiClient.put<User>('update_user', { user_id: userId, ...user });
  },

  async getOrders(params?: { 
    page?: number; 
    per_page?: number; 
    order_by?: string; 
    order?: string;
    order_status?: string;
    payment_status?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    user_id?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.order_by) query.append('order_by', params.order_by);
    if (params?.order) query.append('order', params.order);
    if (params?.order_status) query.append('order_status', params.order_status);
    if (params?.payment_status) query.append('payment_status', params.payment_status);
    if (params?.payment_method) query.append('payment_method', params.payment_method);
    if (params?.start_date) query.append('start_date', params.start_date);
    if (params?.end_date) query.append('end_date', params.end_date);
    if (params?.search) query.append('search', params.search);
    if (params?.user_id) query.append('user_id', params.user_id.toString());
    
    const endpoint = `get_orders${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<{ orders: any[]; total?: number; page?: number; per_page?: number; total_pages?: number }>(endpoint);
  },

  async updateOrder(orderId: number, order: {
    order_status?: string;
    payment_status?: string;
    payment_method?: string;
    shipping_address?: string;
    shipping_cost?: number;
    tax?: number;
  }) {
    return apiClient.put('update_order', { order_id: orderId, ...order });
  },

  async getDiscounts(params?: { page?: number; per_page?: number; order_by?: string; order?: string }) {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());
    if (params?.order_by) query.append('order_by', params.order_by);
    if (params?.order) query.append('order', params.order);
    
    const endpoint = `get_discounts${query.toString() ? `?${query.toString()}` : ''}`;
    return apiClient.get<{ discounts: Discount[] }>(endpoint);
  },

  async createDiscount(discount: {
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
  }) {
    return apiClient.put<Discount>('create_discount', discount);
  },

  async createProductImages(productId: number, images: Array<{
    image_url: string;
    alt_text?: string;
    sort_order?: number;
    is_primary?: boolean;
  }>) {
    return apiClient.put<{ images: ProductImage[] }>('create_product_image', {
      product_id: productId,
      images,
    });
  },
};

