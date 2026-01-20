import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.get("/users");
      const users = response.data;

      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const token = `mock-jwt-token-${user.id}-${Date.now()}`;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      return {
        success: true,
        user,
        token,
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  },
};

export const postsService = {
  getPosts: async (filters?: any) => {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.tag) params.append("tags_like", filters.tag);
    if (filters?.search) params.append("q", filters.search);
    if (filters?.page) params.append("_page", filters.page.toString());
    if (filters?.limit) params.append("_limit", filters.limit.toString());
    if (filters?.sortBy) {
      params.append("_sort", filters.sortBy);
      params.append("_order", filters.sortOrder || "desc");
    }

    const response = await apiClient.get(`/posts?${params.toString()}`);

    const totalResponse = await apiClient.get("/posts");
    const total = totalResponse.data.length;

    return {
      data: response.data,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total,
        totalPages: Math.ceil(total / (filters?.limit || 10)),
      },
    };
  },

  getPost: async (id: string) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData: any) => {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  },

  updatePost: async (id: string, postData: any) => {
    const response = await apiClient.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: string) => {
    await apiClient.delete(`/posts/${id}`);
    return id;
  },

  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },

  searchPosts: async (query: string) => {
    const response = await apiClient.get(`/posts?q=${query}`);
    return response.data;
  },
};
