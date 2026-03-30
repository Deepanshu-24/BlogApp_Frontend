export interface UserResponse {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
}

export interface UserFull {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  created_at?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  author_id: string;
  posted_at: string;
}

export interface PostFeedResponse {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  author_id: string;
  posted_at: string;
  author_username: string;
  comment_count?: number;
  preview_comments?: CommentResponse[];
}

export interface CommentResponse {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  updated_at?: string | null;
  user_username?: string;
}

export interface LikeCountResponse {
  likes: number;
}

export interface LikeResponse {
  message: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  file?: File | null;
}

export interface CommentRequest {
  content: string;
}
