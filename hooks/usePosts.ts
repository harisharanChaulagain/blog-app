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
  useGetPostQuery,
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

  const createPost = async (postData: CreatePostDTO) => {
    if (!token) throw new Error("No authentication token found");
    return await createPostMutation(postData).unwrap();
  };

  const updatePost = async (id: string, data: UpdatePostDTO) => {
    if (!token) throw new Error("No authentication token found");
    return await updatePostMutation({ id, data }).unwrap();
  };

  const deletePost = async (id: string) => {
    if (!token) throw new Error("No authentication token found");
    try {
      await deletePostMutation(id).unwrap();
      refetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const getPostQuery = (id: string) => useGetPostQuery(id);

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
    getPostQuery,
  };
};
