# Installation & Setup Guide

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
