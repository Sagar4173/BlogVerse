# Deployment Guide

## 🚢 Deployment Options

BlogVerse supports multiple deployment strategies. We recommend Vercel for both frontend and backend due to its serverless architecture and ease of use.

## Vercel Deployment (Recommended)

### Prerequisites

- Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)
- Environment variables configured

### Backend Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Navigate to server directory**

   ```bash
   cd server
   ```

3. **Initialize Vercel project**

   ```bash
   vercel
   ```

   Follow the prompts:

   - Link to existing project or create new
   - Set up project settings
   - Choose deployment settings

4. **Configure Environment Variables**
   In Vercel Dashboard:

   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `EMAIL_SERVICE`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`
     - `CLIENT_URL` (set to your frontend URL)

5. **Deploy**
   ```bash
   vercel --prod
   ```

Your API will be available at `https://your-project-name.vercel.app`

### Frontend Deployment

1. **Update Environment Variables**
   Update `client/.env`:

   ```env
   VITE_API_URL=https://your-api-domain.vercel.app/api
   ```

2. **Navigate to client directory**

   ```bash
   cd client
   ```

3. **Deploy to Vercel**

   ```bash
   vercel
   ```

4. **Configure Build Settings** (if needed)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

Your frontend will be live at `https://your-frontend-name.vercel.app`

## Manual Deployment

### Backend Deployment

#### Using Node.js Server

1. **Prepare the server**

   ```bash
   cd server
   npm install --production
   ```

2. **Set environment variables**

   ```bash
   # Create .env.production file with production values
   cp .env .env.production
   ```

3. **Start the application**
   ```bash
   npm start
   # or with PM2 for production
   pm2 start server.js --name "blogverse-api"
   ```

#### Using Docker

1. **Create Dockerfile** (server/Dockerfile):

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build and run**
   ```bash
   docker build -t blogverse-api .
   docker run -p 5000:5000 --env-file .env blogverse-api
   ```

### Frontend Deployment

#### Static Site Hosting

1. **Build the application**

   ```bash
   cd client
   npm run build
   ```

2. **Deploy to static hosting**
   Upload the `dist/` folder to:
   - **Netlify**: Drag and drop or Git integration
   - **GitHub Pages**: Use `gh-pages` package
   - **AWS S3**: Upload to S3 bucket with static hosting
   - **Firebase Hosting**: Use Firebase CLI

#### Using Nginx

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Environment Configuration

### Production Environment Variables

#### Backend (.env.production)

```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.com
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your-production-email
EMAIL_PASSWORD=your-production-email-password
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Frontend (.env.production)

```env
VITE_API_URL=https://your-api-domain.com/api
```

## Database Setup for Production

### MongoDB Atlas (Recommended)

1. **Create Production Cluster**

   - Choose appropriate tier based on usage
   - Select region close to your users
   - Configure backup and monitoring

2. **Security Configuration**

   - Create production database user
   - Whitelist production server IPs
   - Enable authentication
   - Configure network access

3. **Performance Optimization**
   - Create indexes for frequently queried fields
   - Enable MongoDB Compass for monitoring
   - Set up alerts for performance metrics

## Domain and SSL Setup

### Custom Domain

1. **Configure DNS**

   - Point domain to deployment platform
   - Set up CNAME or A records
   - Configure subdomains if needed

2. **SSL Certificate**
   - Most platforms (Vercel, Netlify) provide automatic SSL
   - For manual setup, use Let's Encrypt or purchased certificates

## Monitoring and Analytics

### Application Monitoring

- **Vercel Analytics** for performance monitoring
- **Sentry** for error tracking
- **Google Analytics** for user analytics

### Server Monitoring

- **New Relic** or **DataDog** for server monitoring
- **MongoDB Atlas monitoring** for database performance
- **Cloudinary analytics** for image delivery metrics

## Deployment Checklist

### Pre-deployment

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Third-party services configured (Cloudinary, Email)
- [ ] CORS origins updated
- [ ] Build process tested locally
- [ ] Security headers configured

### Post-deployment

- [ ] Domain and SSL configured
- [ ] Database connection tested
- [ ] Email functionality verified
- [ ] Image upload working
- [ ] Authentication flow tested
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented

## Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

- Keep previous build artifacts
- Maintain database migration scripts
- Document deployment procedures
- Test rollback procedures regularly

## Performance Optimization

### Frontend Optimization

- Enable gzip compression
- Configure CDN for static assets
- Implement service worker for caching
- Optimize images and fonts

### Backend Optimization

- Enable response compression
- Implement Redis caching
- Optimize database queries
- Use connection pooling

## Security Considerations

### Production Security

- Use HTTPS everywhere
- Implement proper CORS policies
- Regular security updates
- Monitor for vulnerabilities
- Implement rate limiting
- Use secure headers
