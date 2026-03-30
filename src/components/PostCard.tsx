import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Trash2, User, Send, ShieldAlert, Pencil, Feather } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useDeletePost, useUpdatePost } from "@/hooks/use-posts";
import { useToggleLike, useLikeCount, useUserLikeStatus, useCreateComment, useDeleteComment, useComments } from "@/hooks/use-interactions";
import { useAdminDeletePost, useAdminDeleteComment } from "@/hooks/use-admin";
import type { PostFeedResponse, CommentResponse } from "@/lib/types";

export function PostCard({ post }: { post: PostFeedResponse }) {
  const { data: user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(post.image_url || "");

  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();
  const adminDeletePost = useAdminDeletePost();
  const toggleLike = useToggleLike();
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const adminDeleteComment = useAdminDeleteComment();
  const { data: likeData } = useLikeCount(post.id);
  const { data: userLikeStatus } = useUserLikeStatus(post.id);
  const { data: fetchedComments, isLoading: commentsLoading } = useComments(post.id);
  let comments: CommentResponse[] = [];
  if (Array.isArray(fetchedComments)) {
    comments = fetchedComments;
  } else if (fetchedComments && typeof fetchedComments === 'object') {
    if ('comments' in fetchedComments && Array.isArray((fetchedComments as any).comments)) {
      comments = (fetchedComments as any).comments;
    } else if ('data' in fetchedComments && Array.isArray((fetchedComments as any).data)) {
      comments = (fetchedComments as any).data;
    } else if ('id' in fetchedComments) {
      comments = [fetchedComments as any];
    }
  }

  useEffect(() => {
    if (userLikeStatus?.has_liked !== undefined) {
      setIsLiked(userLikeStatus.has_liked);
    }
  }, [userLikeStatus?.has_liked]);

  const isAuthor = user?.id === post.author_id;
  const isAdmin = user?.is_admin;

  const handleLike = () => {
    if (!user) return;
    setIsLiked(!isLiked);
    toggleLike.mutate(post.id, {
      onError: () => setIsLiked(!isLiked),
    });
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || !user) return;

    createComment.mutate(
      { postId: post.id, content: commentContent },
      {
        onSuccess: (newComment) => {
          queryClient.setQueryData(["comments", post.id], (oldData: CommentResponse[] | undefined) => {
            return oldData ? [...oldData, newComment] : [newComment];
          });
          queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
          setCommentContent("");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Delete this comment?")) {
      deleteComment.mutate(commentId, {
        onSuccess: () => {
          queryClient.setQueryData(["comments", post.id], (oldData: CommentResponse[] | undefined) => {
            return oldData ? oldData.filter(c => c.id !== commentId) : [];
          });
          queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
        },
      });
    }
  };

  const handleAdminDeleteComment = (commentId: string) => {
    if (confirm("ADMIN: Delete this comment?")) {
      adminDeleteComment.mutate(commentId, {
        onSuccess: () => {
          queryClient.setQueryData(["comments", post.id], (oldData: CommentResponse[] | undefined) => {
            return oldData ? oldData.filter(c => c.id !== commentId) : [];
          });
          queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
        },
      });
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost.mutate(post.id);
    }
  };

  const handleAdminDelete = () => {
    if (confirm("ADMIN: Delete this post? This action is irreversible.")) {
      adminDeletePost.mutate(post.id);
    }
  };

  const renderComment = (comment: CommentResponse) => {
    const isOwnComment = user?.id === comment.user_id;
    return (
      <div key={comment.id} className="flex gap-3 mb-1">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{
          background: 'rgba(160, 120, 60, 0.08)',
          border: '1px solid rgba(160, 120, 60, 0.15)',
        }}>
          <User className="w-3.5 h-3.5 text-amber-800/35" />
        </div>
        <div className="bg-white/50 rounded-lg rounded-tl-sm px-4 py-3 border border-amber-800/8 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm" style={{ color: 'rgba(60, 45, 30, 0.75)' }}>{comment.content}</p>
            <div className="flex gap-1 shrink-0">
              {isOwnComment && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-amber-800/20 hover:text-red-600 transition-colors"
                  title="Delete comment"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
              {isAdmin && !isOwnComment && (
                <button
                  onClick={() => handleAdminDeleteComment(comment.id)}
                  className="text-amber-400/50 hover:text-amber-500 transition-colors"
                  title="Admin: Delete comment"
                >
                  <ShieldAlert className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-amber-800/25 mt-1">
            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="leather-card rounded-lg overflow-hidden card-hover relative"
    >
      {post.image_url && (
        <div className="w-full flex items-center justify-center p-4" style={{ backgroundColor: '#fdf8f0' }}>
          <img
            src={post.image_url}
            alt={post.title}
            className="max-w-full max-h-96 object-contain rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, rgba(160, 120, 60, 0.12), rgba(140, 100, 50, 0.2))',
              border: '1px solid rgba(160, 120, 60, 0.2)',
            }}>
              <Feather className="w-4 h-4 text-amber-800/50" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'hsl(25, 35%, 20%)' }}>{post.author_username}</p>
              <p className="text-xs text-amber-800/35">
                {formatDistanceToNow(new Date(post.posted_at), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            {isAuthor && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="text-amber-800/30 hover:text-amber-800 hover:bg-amber-800/8 rounded-md h-8 w-8"
                  title="Edit post"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-amber-800/30 hover:text-red-700 hover:bg-red-50 rounded-md h-8 w-8"
                  title="Delete post"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            {isAdmin && !isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAdminDelete}
                className="text-amber-500/50 hover:text-amber-600 hover:bg-amber-50 rounded-md h-8 w-8"
                title="Admin: Delete post"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {previewImage && (
              <div className="w-full h-44 overflow-hidden rounded-lg border border-amber-800/15">
                <img src={previewImage} alt="Post preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="cursor-pointer text-sm text-amber-800/60 hover:text-amber-800 underline decoration-amber-800/20 underline-offset-4">
                Change image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditImageFile(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
              <span className="text-xs text-amber-800/30">Leave blank to keep existing image</span>
            </div>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Post title"
              className="text-lg font-display font-semibold bg-white/50 border-amber-800/15"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-amber-800/15 bg-white/50 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-700/15 focus:border-amber-700/30 quill-input"
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="rounded-md text-amber-800/60 bg-amber-800/5 hover:bg-amber-800/10 border border-amber-800/10"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  updatePost.mutate(
                    { postId: post.id, title: editTitle, content: editContent, file: editImageFile, image_url: post.image_url },
                    {
                      onSuccess: () => {
                        setIsEditing(false);
                        if (editImageFile) {
                          setEditImageFile(null);
                        }
                        toast({ title: "Post updated successfully!" });
                      },
                      onError: (err: any) => {
                        toast({ title: "Failed to update", description: err.message, variant: "destructive" });
                      },
                    }
                  );
                }}
                className="rounded-md wax-seal-btn"
                disabled={updatePost.isPending || !editTitle.trim() || !editContent.trim()}
              >
                {updatePost.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-display font-bold mb-2" style={{ color: 'hsl(25, 35%, 15%)' }}>{post.title}</h2>
            <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: 'rgba(60, 45, 30, 0.7)', lineHeight: '1.8' }}>{post.content}</p>
          </>
        )}

        {!commentsLoading && comments.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(160, 130, 90, 0.2)' }}>
            {renderComment(comments[0])}
          </div>
        )}

        <div className={`mt-2 pt-2 flex items-center gap-3 ${comments.length === 0 ? 'mt-5 pt-4 border-t border-amber-800/20' : ''}`} style={{ borderTop: comments.length === 0 ? '1px solid rgba(160, 130, 90, 0.2)' : 'none' }}>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-md ${isLiked ? "text-rose-600 hover:text-rose-700" : "text-amber-800/35 hover:text-amber-800/60"} hover:bg-amber-800/5`}
            onClick={handleLike}
            disabled={!user}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span className="font-medium text-xs">{likeData?.likes ?? 0}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 rounded-md ${showComments ? "text-amber-800 bg-amber-800/5" : "text-amber-800/35"} hover:text-amber-800/60 hover:bg-amber-800/5`}
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium text-xs">
              {comments.length > 1 ? `View ${comments.length - 1} more comment${comments.length - 1 !== 1 ? "s" : ""}` : "Comment"}
            </span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 py-4"
            style={{
              borderTop: '1px solid rgba(160, 130, 90, 0.15)',
              background: 'rgba(245, 238, 225, 0.5)',
            }}
          >
            {user ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <Input
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  className="rounded-md bg-white/60 border-amber-800/12 focus:border-amber-700/25 text-sm"
                  disabled={createComment.isPending}
                  maxLength={100}
                  minLength={3}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-md shrink-0 wax-seal-btn h-9 w-9"
                  disabled={!commentContent.trim() || createComment.isPending}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            ) : (
              <p className="text-sm text-amber-800/35 text-center py-4">
                Log in to leave a comment.
              </p>
            )}

            <div className="space-y-4">
              {commentsLoading ? (
                <p className="text-sm text-amber-800/40 text-center py-4">Loading comments...</p>
              ) : comments.slice(1).map(renderComment)}
              {!commentsLoading && comments.length <= 1 && user && (
                <p className="text-sm text-amber-800/30 text-center italic py-2">
                  No more comments to show.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
