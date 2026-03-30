# Comment Display Debugging Guide

## The Issue
- Comments are stored in the database ✓
- API should return them in `/posts/feed` endpoint
- Frontend is not displaying them

## What Should Happen
1. Backend `/posts/feed` returns `PostFeedResponse[]` with:
   - `comment_count: int` - total count of comments
   - `preview_comments: CommentResponse[]` - first 2 comments with `user_username`

2. Frontend displays:
   - Comment count in the button
   - Preview comments (up to 2) when collapsed
   - All comments when expanded

## Step-by-Step Debugging

### Step 1: Check Browser Console Logs
1. Open your browser DevTools (F12)
2. Go to the Console tab
3. Look for logs starting with:
   - `[useFeed]` - shows what `/posts/feed` returns
   - `[PostCard Debug]` - shows post structure
   - `[Comments]` - shows what `/comment/post/{id}/comments` returns

### Step 2: Run the Debug API Function
In the browser console, run:
```javascript
window.debugApiResponse()
```

This will output:
- Full API response
- First post structure
- Whether `comment_count` exists
- Whether `preview_comments` exists
- Whether `user_username` is in comments

### Step 3: Check the Actual Response
The output should look like:
```json
[
  {
    "id": "...",
    "title": "...",
    "content": "...",
    "author_username": "...",
    "comment_count": 5,
    "preview_comments": [
      {
        "id": "...",
        "content": "Great post!",
        "user_id": "...",
        "post_id": "...",
        "created_at": "...",
        "user_username": "john_doe"
      }
    ]
  }
]
```

### Step 4: Identify the Issue

#### If `comment_count` and `preview_comments` are missing:
- **Problem**: Backend is not returning these fields
- **Solution**: Check backend's `PostFeedResponse` model and `get_feed` endpoint
- **Fix**: Ensure the endpoint is correctly constructing `preview_comments` list

#### If fields exist but comments not displaying:
- **Problem**: Frontend not accessing them correctly
- **Solution**: Check the console logs to see what's being parsed

#### If `user_username` is missing from comments:
- **Problem**: Backend's `CommentResponse` not including it
- **Solution**: Update backend to include username when creating comments list

## Backend Expectation

The backend should return something like:
```python
# In /posts/feed endpoint
for post in posts:
    comment_count = len(post.comments)
    preview = post.comments[:2]
    preview_comments = [
        CommentResponse(
            id=c.id,
            content=c.content,
            user_id=c.user_id,
            post_id=c.post_id,
            created_at=c.created_at,
            updated_at=c.updated_at,
            user_username=c.user.username if c.user else "Unknown"
        )
        for c in preview
    ]
    result.append(PostFeedResponse(
        # ... other fields ...
        comment_count=comment_count,
        preview_comments=preview_comments
    ))
```

## Frontend Files Modified

### 1. `src/lib/types.ts`
- Added `comment_count: number` to `PostFeedResponse`
- Added `preview_comments: CommentResponse[]` to `PostFeedResponse`
- Added `user_username?: string` to `CommentResponse`

### 2. `src/components/PostCard.tsx`
- Displays comments from `post.preview_comments` initially
- Fetches full comments from `/comment/post/{id}/comments` when expanded
- Shows author username on each comment
- Allows delete with proper permissions:
  - Users can delete their own comments
  - Post owners can delete any comment
  - Admins can delete any comment

### 3. `src/hooks/use-interactions.ts`
- `useComments()` - fetches all comments for a post
- Includes debugging logs

### 4. `src/hooks/use-posts.ts`
- `useFeed()` - fetches posts with feeds
- Includes debugging logs for response structure

## What to Check in Backend

If comments aren't showing, verify:

1. **Post model has comments relationship**
   ```python
   class Post(Base):
       __tablename__ = "posts"
       # ... other fields ...
       comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
   ```

2. **Comment model has user relationship**
   ```python
   class Comment(Base):
       __tablename__ = "comments"
       # ... other fields ...
       user = relationship("User")
   ```

3. **`get_feed` endpoint properly loads comments**
   ```python
   .options(joinedload(Post.comments).joinedload(Comment.user))
   ```

4. **`CommentResponse` includes `user_username`**
   ```python
   class CommentResponse(BaseModel):
       id: UUID
       content: str
       user_id: UUID
       post_id: UUID
       created_at: datetime
       updated_at: Optional[datetime]
       user_username: str  # ← This must be here
   ```

## Quick Checklist

- [ ] Run `window.debugApiResponse()` in console
- [ ] Check if `comment_count` appears in response
- [ ] Check if `preview_comments` appears in response
- [ ] Check if comments have `user_username`
- [ ] Check browser console for `[useFeed]` logs
- [ ] Check browser console for `[PostCard Debug]` logs
- [ ] Verify backend is returning the data
- [ ] If missing, fix backend endpoint
