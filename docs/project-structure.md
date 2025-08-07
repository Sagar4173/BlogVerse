# Project Structure

## 📁 Detailed Project Structure

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
├── docs/                      # Documentation files
└── README.md                  # Project overview
```

## Component Architecture

### Frontend Components

#### Core Components

- `App.tsx` - Main application component with routing
- `Header.tsx` - Main site header with navigation
- `Navbar.tsx` - Navigation component
- `Footer.tsx` - Site footer

#### Feature Components

- `BlogCard.tsx` - Individual blog post card display
- `CategoryCards.tsx` - Category navigation cards
- `UserProfileCard.tsx` - User profile display component
- `UserActivityTimeline.tsx` - Activity feed component

#### Authentication Components

- `ProtectedRoute.tsx` - Route protection wrapper
- `PrivateRoute.tsx` - Private route wrapper
- `PasswordStrengthIndicator.tsx` - Password validation UI

#### Dialog Components

- `FollowersListDialog.tsx` - Followers/Following modal

### Backend Structure

#### Models

- `User.js` - User data schema and validation
- `Blog.js` - Blog post schema and relationships

#### Routes Organization

- `auth.js` - Authentication and user management
- `blogs.js` - Blog CRUD and interactions
- `users.js` - User profile and social features
- `upload.js` - File handling and Cloudinary integration

#### Middleware

- `auth.js` - JWT token validation
- `validation.js` - Input sanitization and validation
- `rateLimiter.js` - API rate limiting

## Folder Naming Conventions

- **PascalCase** for React components (`BlogCard.tsx`)
- **camelCase** for utility files (`dateUtils.ts`)
- **kebab-case** for configuration files (`tailwind.config.js`)
- **lowercase** for backend files (`auth.js`)

## Import/Export Patterns

### Frontend

- Default exports for React components
- Named exports for utility functions
- Barrel exports in index files

### Backend

- CommonJS module.exports
- Destructured imports for better tree shaking
- Centralized configuration files
