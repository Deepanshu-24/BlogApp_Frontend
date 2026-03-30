import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { LikeCountResponse, CommentResponse } from "@/lib/types";

export function useLikeCount(postId: string) {
  return useQuery({
    queryKey: ["likes", postId],
    queryFn: () => fetchApi<LikeCountResponse>(`/like/post/${postId}/like_count`),
  });
}

export function useUserLikeStatus(postId: string) {
  return useQuery({
    queryKey: ["user_like_status", postId],
    queryFn: () => fetchApi<{ has_liked: boolean }>(`/like/post/${postId}/user_like_status`),
    retry: false,
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      return fetchApi(`/like/post/${postId}/like`, { method: "POST" });
    },
    onSuccess: (_, postId) => {
      // Invalidate and refetch the like count and user like status
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
      queryClient.invalidateQueries({ queryKey: ["user_like_status", postId] });
      // Ensure the queries refetch immediately
      queryClient.refetchQueries({ queryKey: ["likes", postId] });
      queryClient.refetchQueries({ queryKey: ["user_like_status", postId] });
    },
  });
}

export function useCreateComment() {
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      return fetchApi<CommentResponse>(`/comment/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
    },
  });
}

export function useDeleteComment() {
  return useMutation({
    mutationFn: async (commentId: string) => {
      return fetchApi(`/comment/comments/${commentId}`, { method: "DELETE" });
    },
  });
}


export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      try {
        const data = await fetchApi<CommentResponse[]>(`/comment/post/${postId}/comments`);
        console.log(`[Comments] Fetched for post ${postId}:`, {
          data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A',
          sample: Array.isArray(data) && data.length > 0 ? data[0] : 'no data',
        });
        return data;
      } catch (error) {
        console.error(`[Comments] Error fetching for post ${postId}:`, error);
        throw error;
      }
    },
    staleTime: 0, // Always consider data stale - force refetch
    gcTime: 0, // Don't cache
    retry: 2,
    retryDelay: 500,
  });
}
