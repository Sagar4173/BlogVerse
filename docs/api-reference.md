# API Reference

## 🔧 API Endpoints Overview

The BlogVerse API provides comprehensive endpoints for managing users, blogs, authentication, and more. All endpoints are prefixed with `/api`.

## Authentication

All authenticated endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication Routes (`/api/auth`)

### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Registration successful. Please check your email for verification.",
  "userId": "user_id_here"
}
```

### Verify Email

```http
POST /api/auth/verify-email
```

**Request Body:**

```json
{
  "userId": "user_id_here",
  "otp": "123456"
}
```

### Resend OTP

```http
POST /api/auth/resend-otp
```

**Request Body:**

```json
{
  "userId": "user_id_here"
}
```

### User Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isVerified": true
  }
}
```

### Forgot Password

```http
POST /api/auth/forgot-password
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

### Reset Password

```http
POST /api/auth/reset-password/:token
```

**Request Body:**

```json
{
  "password": "newpassword123"
}
```

### Get Current User

```http
GET /api/auth/me
```

_Requires authentication_

### Update Profile

```http
PUT /api/auth/profile
```

_Requires authentication_

**Request Body:**

```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username"
  }
}
```

## User Routes (`/api/users`)

### Get Current User Profile

```http
GET /api/users/me
```

_Requires authentication_

### Get User Profile by ID

```http
GET /api/users/profile/:id
```

**Response:**

```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "bio": "User bio",
    "avatar": "avatar_url",
    "followersCount": 10,
    "followingCount": 5,
    "postsCount": 3
  }
}
```

### Follow User

```http
POST /api/users/:id/follow
```

_Requires authentication_

### Unfollow User

```http
POST /api/users/:id/unfollow
```

_Requires authentication_

### Get User's Followers

```http
GET /api/users/:id/followers
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Get User's Following

```http
GET /api/users/:id/following
```

### Search Users

```http
GET /api/users/search
```

**Query Parameters:**

- `q`: Search query
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Dashboard Statistics

```http
GET /api/users/dashboard/stats
```

_Requires authentication_

**Response:**

```json
{
  "stats": {
    "totalPosts": 10,
    "totalViews": 1500,
    "totalLikes": 250,
    "totalComments": 80,
    "followersCount": 45,
    "followingCount": 20
  }
}
```

### Get Recent Activity

```http
GET /api/users/dashboard/activity
```

_Requires authentication_

### Bookmark Blog

```http
POST /api/users/bookmarks/:blogId
```

_Requires authentication_

## Blog Routes (`/api/blogs`)

### Get All Published Blogs

```http
GET /api/blogs
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `author` (optional): Filter by author ID
- `sortBy` (optional): Sort by 'createdAt', 'likes', 'views' (default: 'createdAt')
- `sortOrder` (optional): 'asc' or 'desc' (default: 'desc')

### Create New Blog Post

```http
POST /api/blogs
```

_Requires authentication_

**Request Body:**

```json
{
  "title": "Blog Post Title",
  "content": "Blog post content here...",
  "category": "Technology",
  "coverImage": "image_url",
  "tags": ["react", "nodejs", "mongodb"],
  "isDraft": false
}
```

### Get Specific Blog

```http
GET /api/blogs/:id
```

**Response:**

```json
{
  "blog": {
    "id": "blog_id",
    "title": "Blog Title",
    "content": "Blog content...",
    "author": {
      "id": "author_id",
      "name": "Author Name",
      "avatar": "avatar_url"
    },
    "category": "Technology",
    "tags": ["react", "nodejs"],
    "likesCount": 15,
    "commentsCount": 8,
    "views": 120,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "isLiked": false,
    "isBookmarked": false
  }
}
```

### Update Blog Post

```http
PUT /api/blogs/:id
```

_Requires authentication and ownership_

### Delete Blog Post

```http
DELETE /api/blogs/:id
```

_Requires authentication and ownership_

### Like/Unlike Blog

```http
POST /api/blogs/:id/like
```

_Requires authentication_

### Add Comment

```http
POST /api/blogs/:id/comments
```

_Requires authentication_

**Request Body:**

```json
{
  "content": "This is a comment"
}
```

### Reply to Comment

```http
POST /api/blogs/:id/comments/:commentId/replies
```

_Requires authentication_

**Request Body:**

```json
{
  "content": "This is a reply"
}
```

### Get Blog Categories

```http
GET /api/blogs/categories
```

**Response:**

```json
{
  "categories": [
    {
      "name": "Technology",
      "count": 25,
      "description": "Tech-related posts"
    },
    {
      "name": "Lifestyle",
      "count": 18,
      "description": "Lifestyle and personal posts"
    }
  ]
}
```

### Get Blogs by Category

```http
GET /api/blogs/category/:category
```

### Search Blogs

```http
GET /api/blogs/search
```

**Query Parameters:**

- `q`: Search query
- `category` (optional): Filter by category
- `page` (optional): Page number
- `limit` (optional): Items per page

### Get Current User's Posts

```http
GET /api/blogs/user/posts
```

_Requires authentication_

### Get Bookmarked Posts

```http
GET /api/blogs/user/bookmarks
```

_Requires authentication_

### Get Draft Posts

```http
GET /api/blogs/drafts
```

_Requires authentication_

### Publish Draft

```http
PUT /api/blogs/:id/publish
```

_Requires authentication and ownership_

## Upload Routes (`/api/upload`)

### Upload Image

```http
POST /api/upload/image
```

_Requires authentication_

**Request:** Multipart form data with image file

**Response:**

```json
{
  "imageUrl": "https://cloudinary-url.com/image.jpg",
  "publicId": "image_public_id"
}
```

### Delete Image

```http
DELETE /api/upload/image/:public_id
```

_Requires authentication_

## Contact & Newsletter Routes

### Submit Contact Form

```http
POST /api/contact
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here"
}
```

### Subscribe to Newsletter

```http
POST /api/newsletter/subscribe
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

### Unsubscribe from Newsletter

```http
POST /api/newsletter/unsubscribe
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": true,
  "message": "Error description",
  "details": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

### Authentication Endpoints

- **Login/Register**: 5 requests per 15 minutes per IP
- **Password Reset**: 3 requests per hour per IP
- **Email Verification**: 5 requests per hour per user

### General API Endpoints

- **Blog Creation**: 10 posts per hour per user
- **Comments**: 30 comments per hour per user
- **File Uploads**: 20 uploads per hour per user

## Pagination

All list endpoints support pagination:

**Query Parameters:**

- `page`: Page number (starts from 1)
- `limit`: Items per page (max 50)

**Response Format:**

```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## WebSocket Events (Socket.io)

### Connection

```javascript
const socket = io("http://localhost:5000");
```

### Events

#### Join User Room

```javascript
socket.emit("join-user", userId);
```

#### New Notification

```javascript
socket.on("notification", (data) => {
  // Handle notification
  console.log(data);
});
```

#### New Comment

```javascript
socket.on("new-comment", (data) => {
  // Handle new comment on user's post
});
```

#### New Follow

```javascript
socket.on("new-follower", (data) => {
  // Handle new follower notification
});
```
