import { useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCategoriesQuery,
  CreatePostDTO,
  UpdatePostDTO,
  PostFilters,
} from "@/store/postSlice";
import { RootState } from "@/store/store";

export const usePosts = (filters?: PostFilters) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    error: postsError,
    refetch: refetchPosts,
  } = useGetPostsQuery(filters || {}, {
    skip: !token,
  });

  const [createPostMutation, { isLoading: isCreating, error: createError }] =
    useCreatePostMutation();
  const [updatePostMutation, { isLoading: isUpdating, error: updateError }] =
    useUpdatePostMutation();
  const [deletePostMutation, { isLoading: isDeleting, error: deleteError }] =
    useDeletePostMutation();

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useGetCategoriesQuery(undefined, {
    skip: !token,
  });

  const createPost = useCallback(
    async (postData: CreatePostDTO) => {
      if (!token) {
        throw new Error("No authentication token found");
      }

      try {
        const result = await createPostMutation(postData).unwrap();
        return result;
      } catch (error) {
        console.error("Error creating post:", error);
        throw error;
      }
    },
    [createPostMutation, token]
  );

  const updatePost = useCallback(
    async (id: string, data: UpdatePostDTO) => {
      if (!token) {
        throw new Error("No authentication token found");
      }

      try {
        const result = await updatePostMutation({ id, data }).unwrap();
        return result;
      } catch (error) {
        console.error("Error updating post:", error);
        throw error;
      }
    },
    [updatePostMutation, token]
  );

  const deletePost = useCallback(
    async (id: string) => {
      if (!token) {
        throw new Error("No authentication token found");
      }

      try {
        await deletePostMutation(id).unwrap();
        return id;
      } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
      }
    },
    [deletePostMutation, token]
  );

  return {
    posts: postsData?.data || [],
    pagination: postsData?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },

    categories: categories || [],

    isLoading: isLoadingPosts,
    isLoadingCategories,
    isCreating,
    isUpdating,
    isDeleting,

    error: postsError || createError || updateError || deleteError,
    categoriesError,

    createPost,
    updatePost,
    deletePost,
    refetchPosts,
  };
};
