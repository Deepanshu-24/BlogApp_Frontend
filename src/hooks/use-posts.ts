import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { PostFeedResponse, PostResponse, CreatePostRequest } from "@/lib/types";

const PAGE_SIZE = 10;

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
      const offset = pageParam * PAGE_SIZE;
      const response = await fetchApi<PostFeedResponse[]>(`/posts/feed?limit=${PAGE_SIZE}&offset=${offset}`);
      
      console.log(`[useFeed] Response for page ${pageParam}:`, {
        count: response?.length || 0,
        sample: response && response.length > 0 ? {
          id: response[0].id,
          title: response[0].title,
          author_username: response[0].author_username,
          comment_count: (response[0] as any).comment_count,
          preview_comments: (response[0] as any).preview_comments?.length,
          fullSample: response[0],
        } : 'no data',
      });
      
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: PostFeedResponse[], allPages: PostFeedResponse[][]) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.file) {
        formData.append("file", data.file);
      }

      return fetchApi<PostResponse>("/posts", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return fetchApi(`/posts/${postId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, title, content, file, image_url }: { postId: string; title: string; content: string; file?: File | null; image_url?: string | null }) => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      
      if (file) {
        formData.append("file", file);
      } else if (image_url) {
        // If no file but we had an existing image, send it so it's not lost
        formData.append("image_url", image_url);
      }

      return fetchApi<PostResponse>(`/posts/${postId}`, {
        method: "PUT",
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
