# QUICK DEBUG STEPS

## Immediate Actions

### 1. Open Browser Console
- Press `F12` or right-click → "Inspect" → "Console"

### 2. Run the Debug Function
Paste this in the console:
```javascript
window.debugApiResponse()
```

### 3. What to Look For

**SUCCESS** - You should see in the console:
```
=== FIRST POST STRUCTURE ===
Keys: [... "comment_count", "preview_comments", ...]

=== COMMENT FIELDS ===
comment_count: 5 number
preview_comments: Array(2)
preview_comments is array: true
preview_comments length: 2

First preview comment: {
  id: "...",
  content: "Test comment",
  user_id: "...",
  post_id: "...",
  created_at: "...",
  user_username: "john_doe"
}
Comment has user_username: true
```

**ISSUE** - If you see:
```
comment_count: undefined
preview_comments: undefined
```
→ **Backend is NOT returning these fields**

**ISSUE** - If you see:
```
comment_count: 3
preview_comments: undefined
```
→ **Backend returning comment_count but NOT preview_comments**

## What Needs to Be Fixed

### If Backend is Missing Fields
The `/posts/feed` endpoint needs to return `comment_count` and `preview_comments` in the response. Based on your GitHub code, it SHOULD be returning these, but the serialization might be failing.

**Check in backend:**
1. Verify `PostFeedResponse` model has these fields
2. Verify the response is being constructed with `preview_comments=preview_comments`
3. Check if there's a serialization issue with the Comment objects

### If Frontend is Not Displaying
The browser console logs should show:
- `[useFeed]` logs → showing what `/posts/feed` returns
- `[PostCard Debug]` logs → showing the post structure received

Look at these logs to see if the data is there but not rendering.

## File Changes Made

✅ **src/lib/types.ts**
- Added `comment_count` to `PostFeedResponse`
- Added `preview_comments` to `PostFeedResponse`
- Added `user_username` to `CommentResponse`

✅ **src/components/PostCard.tsx**
- Updated to use `post.preview_comments` initially
- Updated to display `comment.user_username`
- Updated to allow post owners to delete any comment
- Added fallback logic if comment_count is missing

✅ **src/hooks/use-interactions.ts**
- Enhanced logging in `useComments()`

✅ **src/hooks/use-posts.ts**
- Enhanced logging in `useFeed()`

✅ **src/debug-api.ts** (NEW)
- Debug script to inspect API response

✅ **src/main.tsx**
- Imported debug script

## Expected Data Flow

```
GET /posts/feed
↓
Returns PostFeedResponse[] with:
  - comment_count: 5
  - preview_comments: [Comment1, Comment2]
↓
Frontend shows comment count in button
Frontend shows 2 preview comments when collapsed
↓
User clicks "Comments"
↓
GET /comment/post/{id}/comments
↓
Returns all comments
↓
Frontend shows all comments
```

## Report Back With

After running `window.debugApiResponse()`, tell me:

1. **Do you see `comment_count` in the response?** (yes/no/value)
2. **Do you see `preview_comments` in the response?** (yes/no)
3. **What's the value of `preview_comments`?** (array/undefined/null)
4. **Do the comment objects have `user_username`?** (yes/no)
5. **Paste the console output** from `[useFeed]` logs

This will help pinpoint exactly where the issue is!
