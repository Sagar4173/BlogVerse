# BlogVerse - Complete Full-Stack Blog Platform

A modern, feature-rich blogging platform built with React, Node.js, Express, and MongoDB. BlogVerse provides a seamless experience for writers and readers with advanced features like real-time notifications, social interactions, and rich content editing.

## 🌟 Features

### 📝 Content Management

- Rich text editor with formatting options
- Draft and published post management
- Category-based organization
- Cover image uploads via Cloudinary
- SEO-friendly URLs

### 👥 Social Features

- User profiles with custom bios and avatars
- Follow/unfollow system
- Like and comment on posts
- Bookmark favorite articles
- Real-time notifications

### 🔐 Authentication & Security

- Email verification with OTP
- Password reset functionality
- JWT-based authentication
- Protected routes and APIs
- Input validation and sanitization

### 📊 Analytics & Dashboard

- User analytics dashboard
- Post performance metrics
- Engagement statistics
- Recent activity timeline

### 🎨 Modern UI/UX

- Responsive design with Tailwind CSS
- Material-UI components
- Dark/light theme support
- Smooth animations with Framer Motion
- Progressive Web App (PWA) features

## 🚀 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Material-UI** for components
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Quill** for rich text editing
- **Recharts** for analytics visualization

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Nodemailer** for email services
- **Socket.io** for real-time features
- **Express Validator** for input validation

### Deployment

- **Vercel** for both frontend and backend
- **MongoDB Atlas** for database hosting
- **Cloudinary** for image CDN

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account for image uploads
- Gmail account for email services

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Sagar4173/BlogVerse.git
cd BlogVerse
```

### 2. Install dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd client
npm install
```

### 3. Environment Configuration

Create `.env` files in both server and client directories using the provided `.env.example` template.

#### Server (.env)

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Setup

If using MongoDB Atlas:

1. Create a cluster
2. Create a database user
3. Get the connection string
4. Replace the MONGODB_URI in your .env file

### 5. Cloudinary Setup

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Add them to your .env file

### 6. Email Setup

For Gmail:

1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in EMAIL_PASSWORD

## 🏃‍♂️ Running the Application

### Development Mode

#### Start the server

```bash
cd server
npm run dev
```

#### Start the client

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Production Build

#### Build the client

```bash
cd client
npm run build
```

#### Start the server in production

```bash
cd server
npm start
```

## 📁 Project Structure

```
BlogVerse/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚢 Deployment

### Vercel Deployment

#### Backend Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. In the server directory: `vercel`
3. Configure environment variables in Vercel dashboard
4. Update CORS settings with your frontend URL

#### Frontend Deployment

1. In the client directory: `vercel`
2. Update VITE_API_URL to your deployed backend URL

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- NODE_ENV=production
- MONGODB_URI (production database)
- JWT_SECRET (strong secret)
- CLOUDINARY\_\* (your Cloudinary credentials)
- EMAIL\_\* (your email service credentials)
- CLIENT_URL (your deployed frontend URL)

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password/:token` - Password reset

### Users

- `GET /api/users/me` - Get current user
- `GET /api/users/profile/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Blogs

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/:id` - Get specific blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog
- `POST /api/blogs/:id/comments` - Add comment

## 🔒 Security Features

- Input validation and sanitization
- Rate limiting on sensitive endpoints
- CORS configuration
- JWT token expiration
- Password hashing with bcrypt
- Email verification
- Protected routes

## 🎯 Performance Optimizations

- Image optimization with Cloudinary
- Code splitting with React.lazy
- Memoization with React.memo
- Database query optimization
- Caching strategies
- Lazy loading for images

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check your MONGODB_URI
   - Ensure IP is whitelisted in MongoDB Atlas
   - Verify database user credentials

2. **Email Services Not Working**

   - Use app passwords for Gmail
   - Check EMAIL_SERVICE configuration
   - Verify firewall settings

3. **Image Upload Issues**

   - Check Cloudinary credentials
   - Verify API limits
   - Check file size restrictions

4. **CORS Errors**
   - Ensure CLIENT_URL is correctly set
   - Check CORS configuration in server.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Cloudinary for image management
- Vercel for seamless deployment

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Blogging! 🎉**
