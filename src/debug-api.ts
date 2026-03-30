/**
 * Debug Script - Check what the API is actually returning
 * Run this in browser console or import it in main.tsx temporarily
 */

export async function debugApiResponse() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const token = localStorage.getItem("access_token");
  
  console.log("=== API Debug ===");
  console.log("API URL:", apiUrl);
  console.log("Token exists:", !!token);
  
  try {
    const response = await fetch(`${apiUrl}/posts/feed?limit=1&offset=0`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", {
      contentType: response.headers.get("content-type"),
    });
    
    const data = await response.json();
    
    console.log("=== FULL RESPONSE ===");
    console.log(JSON.stringify(data, null, 2));
    
    if (Array.isArray(data) && data.length > 0) {
      console.log("=== FIRST POST STRUCTURE ===");
      const firstPost = data[0];
      console.log("Keys:", Object.keys(firstPost));
      console.log("First post:", firstPost);
      
      console.log("=== COMMENT FIELDS ===");
      console.log("comment_count:", firstPost.comment_count, typeof firstPost.comment_count);
      console.log("preview_comments:", firstPost.preview_comments);
      console.log("preview_comments type:", typeof firstPost.preview_comments);
      console.log("preview_comments is array:", Array.isArray(firstPost.preview_comments));
      console.log("preview_comments length:", firstPost.preview_comments?.length);
      
      if (Array.isArray(firstPost.preview_comments) && firstPost.preview_comments.length > 0) {
        console.log("First preview comment:", firstPost.preview_comments[0]);
        console.log("Comment has user_username:", "user_username" in firstPost.preview_comments[0]);
      }
    }
    
    return data;
  } catch (error) {
    console.error("Debug error:", error);
  }
}

// Make it available globally
(window as any).debugApiResponse = debugApiResponse;
console.log("Debug script loaded. Run: window.debugApiResponse()");
