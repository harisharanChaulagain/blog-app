import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  excerpt?: string;
}

export interface UpdatePostDTO extends Partial<CreatePostDTO> {}

export interface PostFilters {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
  authorId?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "views" | "likes";
  sortOrder?: "asc" | "desc";
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PostsResponse {
  data: Post[];
  pagination: Pagination;
}


export const postsApi = createApi({
  reducerPath: "postsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),

  tagTypes: ["Post", "Category"],

  endpoints: (builder) => ({

    getPosts: builder.query<PostsResponse, PostFilters | undefined>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (!filters) return "/posts";

        if (filters.category) params.append("category", filters.category);
        if (filters.tag) params.append("tags_like", filters.tag);
        if (filters.search) params.append("q", filters.search);

        if (filters.published !== undefined)
          params.append("published", String(filters.published));

        if (filters.featured !== undefined)
          params.append("featured", String(filters.featured));

        if (filters.page) params.append("_page", String(filters.page));
        if (filters.limit) params.append("_limit", String(filters.limit));

        if (filters.sortBy) {
          params.append("_sort", filters.sortBy);
          params.append("_order", filters.sortOrder ?? "desc");
        }

        const qs = params.toString();
        return `/posts${qs ? `?${qs}` : ""}`;
      },

      transformResponse: (response: Post[], meta, arg) => {
        const total = Number(meta?.response?.headers.get("X-Total-Count") ?? 0);

        const page = arg?.page ?? 1;
        const limit = arg?.limit ?? 10;

        return {
          data: response,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),


    getPost: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Post", id }],
    }),


    createPost: builder.mutation<Post, CreatePostDTO>({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...newPost,
          id: Date.now().toString(),
          slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          author: {
            id: "1",
            name: "Current User",
            avatar: "https://i.pravatar.cc/150?img=1",
          },
          featured: false,
          readTime: Math.max(1, Math.ceil(newPost.content.length / 1000)),
          views: 0,
          likes: 0,
          commentsCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),


    updatePost: builder.mutation<Post, { id: string; data: UpdatePostDTO }>({
      query: ({ id, data }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Post", id }],
    }),

    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    getCategories: builder.query<
      Array<{ id: string; name: string; slug: string; postCount: number }>,
      undefined
    >({
      query: () => "/categories",
      providesTags: [{ type: "Category", id: "LIST" }],
    }),

    searchPosts: builder.query<Post[], string>({
      query: (q) => `/posts?q=${encodeURIComponent(q)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCategoriesQuery,
  useSearchPostsQuery,
} = postsApi;
