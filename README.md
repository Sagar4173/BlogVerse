# BlogVerse - Complete Full-Stack Blog Platform

A modern, feature-rich blogging platform built with React, Node.js, Express, and MongoDB. BlogVerse provides a seamless experience for writers and readers with advanced features like real-time notifications, social interactions, and rich content editing.

## 🌟 Features

### 📝 Content Management

- **Rich Text Editor** with formatting options using React Quill
- **Draft and Published** post management system
- **Category-based** organization for better content discovery
- **Cover Image Uploads** via Cloudinary with automatic optimization
- **SEO-friendly** URLs and meta tags
- **Content Validation** with character limits and HTML sanitization

### 👥 Social Features

- **User Profiles** with custom bios, avatars, and social links
- **Follow/Unfollow System** to build communities
- **Like and Comment** on posts with nested replies
- **Bookmark** favorite articles for later reading
- **Real-time Notifications** for social interactions
- **User Activity Timeline** showing engagement history

### 🔐 Authentication & Security

- **Email Verification** with 6-digit OTP system
- **Password Reset** functionality with secure tokens
- **JWT-based Authentication** with 24-hour expiration
- **Protected Routes** on both client and server
- **Input Validation** and sanitization
- **Rate Limiting** on sensitive endpoints
- **CORS Protection** and security headers

### 📊 Analytics & Dashboard

- **User Analytics Dashboard** with comprehensive metrics
- **Post Performance** tracking (views, likes, comments)
- **Engagement Statistics** and trends
- **Recent Activity Timeline**
- **Publishing Analytics** with charts and graphs

### 🎨 Modern UI/UX

- **Responsive Design** with Tailwind CSS and Material-UI
- **Dark/Light Theme** support with theme persistence
- **Smooth Animations** with Framer Motion
- **Progressive Loading** with skeleton screens
- **Mobile-First** approach with touch-friendly interactions

## 🚀 Tech Stack

### Frontend

- **React 18** with TypeScript for type safety
- **Vite** for fast build tooling and HMR
- **Material-UI (MUI)** for modern UI components
- **Tailwind CSS** for utility-first styling
- **React Router v6** for client-side routing
- **Axios** for HTTP requests with interceptors
- **React Quill** for rich text editing
- **Recharts** for analytics visualization
- **Framer Motion** for animations
- **Socket.io Client** for real-time features

### Backend

- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for stateless authentication
- **Cloudinary** for image storage and optimization
- **Nodemailer** for email services
- **Socket.io** for real-time notifications
- **Express Validator** for input validation
- **Bcrypt.js** for password hashing
- **Helmet** for security headers
- **Express Rate Limit** for API protection

### DevOps & Deployment

- **Vercel** for serverless deployment
- **MongoDB Atlas** for cloud database
- **Cloudinary CDN** for image delivery
- **Git** for version control

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control

### Required Accounts

- **Cloudinary** account for image storage
- **Gmail** account for email services (or other SMTP provider)
- **MongoDB Atlas** account (for cloud database)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sagar4173/BlogVerse.git
cd BlogVerse
```

### 2. Install Dependencies

**Backend Dependencies:**

```bash
cd server
npm install
```

**Frontend Dependencies:**

```bash
cd ../client
npm install
```

### 3. Environment Configuration

Create `.env` files in both server and client directories.

#### Server Environment (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/blogverse
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogverse

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
NODE_ENV=development

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Client Environment (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get the connection string and add it to your `.env` file
5. Whitelist your IP address

### 5. Third-Party Services Setup

#### Cloudinary Setup

1. Create a free Cloudinary account
2. Go to your Cloudinary Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add them to your server `.env` file

#### Email Service Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password in `EMAIL_PASSWORD`

## 🏃‍♂️ Running the Application

### Development Mode

**Start the Backend Server:**

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Start the Frontend Development Server:**

```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Production Mode

**Build the Frontend:**

```bash
cd client
npm run build
```

**Start Production Server:**

```bash
cd server
npm start
```

## 📁 Project Structure

```
BlogVerse/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets and PWA files
│   │   ├── favicon.svg
│   │   ├── blogverse-logo.svg
│   │   └── sw.js              # Service Worker
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── BlogCard.tsx
│   │   │   ├── CategoryCards.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── NotificationsContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useAuth.ts
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Authentication pages
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   └── ResetPassword.tsx
│   │   │   ├── blog/          # Blog-related pages
│   │   │   │   ├── BlogPost.tsx
│   │   │   │   ├── CreatePost.tsx
│   │   │   │   └── CategoryPosts.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Search.tsx
│   │   ├── services/          # API service functions
│   │   │   ├── blogService.ts
│   │   │   ├── userService.ts
│   │   │   └── dashboardService.ts
│   │   ├── types/             # TypeScript type definitions
│   │   │   └── User.ts
│   │   ├── utils/             # Utility functions
│   │   │   └── dateUtils.ts
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Application entry point
│   ├── package.json
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── tsconfig.json          # TypeScript configuration
├── server/                     # Node.js Backend Application
│   ├── config/                # Configuration files
│   │   └── cloudinary.js      # Cloudinary setup
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── validation.js      # Input validation
│   │   └── rateLimiter.js     # Rate limiting
│   ├── models/                # MongoDB/Mongoose models
│   │   ├── User.js            # User schema
│   │   └── Blog.js            # Blog schema
│   ├── routes/                # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   ├── blogs.js           # Blog CRUD operations
│   │   ├── profile.js         # User profile routes
│   │   ├── upload.js          # File upload routes
│   │   ├── contact.js         # Contact form routes
│   │   └── newsletter.js      # Newsletter subscription
│   ├── utils/                 # Utility functions
│   │   ├── dbConnect.js       # Database connection
│   │   ├── email.js           # Email templates and sending
│   │   └── notificationService.js
│   ├── package.json
│   ├── server.js              # Express server setup
│   └── vercel.json            # Vercel deployment config
└── README.md                  # Project documentation
```

## 🚢 Deployment

### Vercel Deployment (Recommended)

#### Backend Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to the server directory
3. Run `vercel` and follow the prompts
4. Set environment variables in Vercel dashboard
5. The API will be available at `https://your-project.vercel.app`

#### Frontend Deployment

1. Update `VITE_API_URL` in client `.env` to point to your deployed API
2. Navigate to the client directory
3. Run `vercel` and follow the prompts
4. Your app will be live at `https://your-frontend.vercel.app`

### Manual Deployment

#### Backend

```bash
cd server
npm run build  # If you have a build script
npm start
```

#### Frontend

```bash
cd client
npm run build
# Serve the dist/ folder with any static file server
```

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - User registration with email verification
- `POST /verify-email` - Verify email with OTP
- `POST /resend-otp` - Resend verification OTP
- `POST /login` - User login
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password with token
- `GET /me` - Get current authenticated user
- `PUT /profile` - Update user profile

### User Routes (`/api/users`)

- `GET /me` - Get current user profile
- `GET /profile/:id` - Get user profile by ID
- `POST /:id/follow` - Follow a user
- `POST /:id/unfollow` - Unfollow a user
- `GET /:id/followers` - Get user's followers
- `GET /:id/following` - Get user's following list
- `GET /search` - Search users
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/activity` - Get recent activity
- `POST /bookmarks/:blogId` - Bookmark/unbookmark a blog

### Blog Routes (`/api/blogs`)

- `GET /` - Get all published blogs
- `POST /` - Create a new blog post
- `GET /:id` - Get specific blog by ID
- `PUT /:id` - Update blog post
- `DELETE /:id` - Delete blog post
- `POST /:id/like` - Like/unlike a blog post
- `POST /:id/comments` - Add comment to blog
- `POST /:id/comments/:commentId/replies` - Reply to comment
- `GET /categories` - Get all blog categories
- `GET /category/:category` - Get blogs by category
- `GET /search` - Search blogs
- `GET /user/posts` - Get current user's posts
- `GET /user/bookmarks` - Get bookmarked posts
- `GET /drafts` - Get user's draft posts
- `PUT /:id/publish` - Publish a draft post

### Upload Routes (`/api/upload`)

- `POST /image` - Upload image to Cloudinary
- `DELETE /image/:public_id` - Delete image from Cloudinary

### Contact & Newsletter (`/api/contact`, `/api/newsletter`)

- `POST /contact` - Submit contact form
- `POST /newsletter/subscribe` - Subscribe to newsletter
- `POST /newsletter/unsubscribe` - Unsubscribe from newsletter

## 🔒 Security Features

### Authentication & Authorization

- **JWT tokens** with secure httpOnly cookie option
- **Password hashing** using bcrypt with salt rounds
- **Email verification** mandatory for account activation
- **Password reset** with secure token expiration
- **Protected routes** on both frontend and backend

### Input Validation & Sanitization

- **Express Validator** for server-side validation
- **MongoDB injection** protection with express-mongo-sanitize
- **XSS protection** with xss-clean middleware
- **HTML sanitization** for user-generated content
- **File upload validation** with type and size restrictions

### API Security

- **Rate limiting** on authentication endpoints
- **CORS configuration** with specific origins
- **Security headers** with Helmet middleware
- **Request size limits** to prevent DoS attacks
- **HPP protection** against HTTP Parameter Pollution

## 🎯 Performance Optimizations

### Frontend Optimizations

- **Code splitting** with React.lazy for route-based chunking
- **Memoization** with React.memo for component optimization
- **Lazy loading** for images and non-critical components
- **Bundle analysis** and tree shaking with Vite
- **Caching strategies** for API responses

### Backend Optimizations

- **Database indexing** on frequently queried fields
- **Query optimization** with MongoDB aggregation
- **Image optimization** with Cloudinary transformations
- **Response compression** with gzip middleware
- **Connection pooling** for database connections

### Image Handling

- **Automatic format selection** (WebP, AVIF fallbacks)
- **Responsive images** with multiple resolutions
- **CDN delivery** via Cloudinary
- **Lazy loading** with intersection observer
- **Placeholder images** during loading

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Errors

**Problem:** Cannot connect to MongoDB

```
MongoNetworkError: failed to connect to server
```

**Solutions:**

- Check MongoDB service is running locally
- Verify MongoDB Atlas connection string and credentials
- Ensure IP address is whitelisted in MongoDB Atlas
- Check firewall settings blocking port 27017

#### 2. Email Service Issues

**Problem:** Emails not sending

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solutions:**

- Enable 2-Factor Authentication on Gmail
- Use App Password instead of regular password
- Check EMAIL_SERVICE configuration
- Verify SMTP settings for custom email providers

#### 3. Image Upload Failures

**Problem:** Cloudinary upload errors

```
Error: Invalid cloud_name
```

**Solutions:**

- Verify Cloudinary credentials in .env file
- Check API key permissions
- Ensure file size is within limits (5MB default)
- Verify internet connection for uploads

#### 4. CORS Errors

**Problem:** Cross-origin request blocked

```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solutions:**

- Add your frontend URL to ALLOWED_ORIGINS
- Check CLIENT_URL environment variable
- Ensure proper CORS middleware configuration
- Verify API endpoint URLs

#### 5. JWT Token Issues

**Problem:** Authentication failures

```
JsonWebTokenError: invalid token
```

**Solutions:**

- Check JWT_SECRET is set and consistent
- Verify token storage in localStorage/cookies
- Check token expiration (24-hour default)
- Clear browser cache and try again

### Development Tips

#### Hot Reload Issues

```bash
# If Vite dev server doesn't detect changes:
rm -rf node_modules/.cache
npm run dev

# For backend nodemon issues:
npx nodemon --inspect server.js
```

#### Database Schema Updates

```bash
# After model changes, restart the server to apply changes
# MongoDB is schemaless, but Mongoose validation will update
```

#### Port Conflicts

```bash
# Check what's running on your ports:
lsof -ti:5000  # Backend port
lsof -ti:5173  # Frontend port

# Kill processes if needed:
kill -9 $(lsof -ti:5000)
```

## 🧪 Testing

### Running Tests

```bash
# Frontend tests (if configured)
cd client
npm test

# Backend tests (if configured)
cd server
npm test
```

### Testing Strategy

- **Unit tests** for utility functions
- **Integration tests** for API endpoints
- **Component tests** for React components
- **E2E tests** for critical user flows

## 🤝 Contributing

We welcome contributions to BlogVerse! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Submit a Pull Request

### Code Style Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Follow component naming conventions

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add screenshots for UI changes
4. Link related issues in PR description
5. Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No liability or warranty

## 🙏 Acknowledgments

### Dependencies & Libraries

- **React Team** for the amazing React framework
- **Vercel** for seamless deployment platform
- **MongoDB** for flexible document database
- **Material-UI** for beautiful component library
- **Cloudinary** for powerful image management
- **Express.js** for robust backend framework

### Inspiration & Resources

- Modern blogging platforms for UX inspiration
- Open source community for best practices
- Stack Overflow for problem-solving assistance
- GitHub for version control and collaboration

## 📞 Support & Contact

### Getting Help

1. **Check Documentation** - Review this README thoroughly
2. **Search Issues** - Look for existing solutions in GitHub Issues
3. **Create Issue** - Report bugs or request features
4. **Discussions** - Join community discussions

### Community

- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - General questions and community chat
- **Pull Requests** - Code contributions and improvements

### Contact Information

- **Project Maintainers** - [Sagar Wavhal](https://github.com/Sagar4173) & [Mrunali Patil](https://github.com/Mrunali394)
- **Repository** - [BlogVerse on GitHub](https://github.com/Sagar4173/BlogVerse)
- **Website** - [Project Homepage](https://blogversehub.vercel.app)

## 🚀 What's Next?

### Planned Features

- [ ] **Real-time Chat** between users
- [ ] **Advanced Analytics** with detailed insights
- [ ] **Content Scheduling** for automated publishing
- [ ] **Multi-language Support** for international users
- [ ] **Mobile App** with React Native
- [ ] **AI-powered** content suggestions
- [ ] **Advanced SEO** tools and optimization
- [ ] **Monetization** features for content creators

### Contributing Opportunities

- 🐛 Bug fixes and improvements
- 🎨 UI/UX enhancements
- 📱 Mobile responsiveness
- ⚡ Performance optimizations
- 🧪 Test coverage improvements
- 📚 Documentation updates
- 🌍 Internationalization
- ♿ Accessibility improvements

---

**Happy Blogging with BlogVerse! 🎉**

_Built with ❤️ by [Sagar Wavhal](https://github.com/Sagar4173) and [Mrunali Patil](https://github.com/Mrunali394)_
