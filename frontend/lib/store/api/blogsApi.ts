import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export interface Blog {
  id: number;
  title: string;
  slug: string | null;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: number | null;
  author_name: string | null;
  status: 'draft' | 'published' | 'archived';
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogListItem {
  id: number;
  title: string;
  slug: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  status: string;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogsResponse {
  blogs: BlogListItem[];
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface GetBlogsParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: 'asc' | 'desc';
  status?: string;
}

export interface GetBlogParams {
  blog_id?: number;
  slug?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ecommerce/v1`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('admin_token') 
      : null;
    
    if (token) {
      // Use 'Authorization' with capital A to match backend expectation
      headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn('[BlogsAPI] No admin_token found in localStorage. User may need to log in.');
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
      // Token expired or invalid - clear it and redirect to login
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        if (token) {
          // Token exists but is invalid/expired - clear it
          localStorage.removeItem('admin_token');
          // Only redirect if we're in an admin page
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        } else {
          // No token - user needs to log in
          if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
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

export const blogsApi = createApi({
  reducerPath: 'blogsApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['Blogs', 'Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogsResponse, GetBlogsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.order_by) queryParams.append('order_by', params.order_by);
        if (params?.order) queryParams.append('order', params.order);
        if (params?.status) queryParams.append('status', params.status);
        
        return `get_blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any): BlogsResponse => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            const data = response.data;
            if ('blogs' in data && Array.isArray(data.blogs)) {
              return {
                blogs: data.blogs,
                total: data.total,
                page: data.page,
                per_page: data.per_page,
                total_pages: data.total_pages,
              };
            }
          }
          if ('blogs' in response && Array.isArray(response.blogs)) {
            return {
              blogs: response.blogs,
            };
          }
          if (Array.isArray(response)) {
            return { blogs: response };
          }
        }
        return { blogs: [] };
      },
      providesTags: ['Blogs'],
    }),

    getPublishedBlogs: builder.query<BlogsResponse, GetBlogsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
        if (params?.order_by) queryParams.append('order_by', params.order_by);
        if (params?.order) queryParams.append('order', params.order);
        
        return `get_published_blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      },
      transformResponse: (response: any): BlogsResponse => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            const data = response.data;
            if ('blogs' in data && Array.isArray(data.blogs)) {
              return {
                blogs: data.blogs,
                total: data.total,
                page: data.page,
                per_page: data.per_page,
                total_pages: data.total_pages,
              };
            }
          }
          if ('blogs' in response && Array.isArray(response.blogs)) {
            return {
              blogs: response.blogs,
            };
          }
          if (Array.isArray(response)) {
            return { blogs: response };
          }
        }
        return { blogs: [] };
      },
      providesTags: ['Blogs'],
    }),

    getBlog: builder.query<Blog, GetBlogParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.blog_id) queryParams.append('blog_id', params.blog_id.toString());
        if (params.slug) queryParams.append('slug', params.slug);
        return `get_blog?${queryParams.toString()}`;
      },
      providesTags: (result, error, params) => [{ type: 'Blog', id: result?.id || params.blog_id || params.slug }],
      transformResponse: (response: any): Blog => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response;
        }
        throw new Error('Invalid response format');
      },
    }),

    createBlog: builder.mutation<Blog, Partial<Blog>>({
      query: (body) => ({
        url: 'create_blog',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Blogs'],
      transformResponse: (response: any): Blog => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response;
        }
        throw new Error('Invalid response format');
      },
    }),

    updateBlog: builder.mutation<Blog, { blog_id: number; [key: string]: any }>({
      query: ({ blog_id, ...body }) => ({
        url: 'update_blog',
        method: 'PUT',
        body: { blog_id, ...body },
      }),
      invalidatesTags: (result, error, { blog_id }) => [
        { type: 'Blog', id: blog_id },
        'Blogs',
      ],
      transformResponse: (response: any): Blog => {
        if (response && typeof response === 'object') {
          if ('data' in response && response.data) {
            return response.data;
          }
          return response;
        }
        throw new Error('Invalid response format');
      },
    }),

    deleteBlog: builder.mutation<{ success: boolean }, number>({
      query: (blogId) => ({
        url: 'delete_blog',
        method: 'POST',
        body: { blog_id: blogId },
      }),
      invalidatesTags: ['Blogs'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetPublishedBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogsApi;

