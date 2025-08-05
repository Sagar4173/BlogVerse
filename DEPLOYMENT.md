# BlogVerse Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Use `.env` for development (NODE_ENV=development)
- [ ] Use `.env.production` for production deployment
- [ ] Update `VITE_API_URL` in client/.env.production to your production API URL
- [ ] Update `CLIENT_URL` in server/.env.production to your production client URL
- [ ] Verify all environment variables are set in Vercel dashboard
- [ ] Double-check MongoDB connection string
- [ ] Verify Cloudinary credentials
- [ ] Confirm email service credentials

### 2. Security Check
- [ ] All console.log statements are wrapped in development checks
- [ ] No sensitive data exposed in client-side code
- [ ] CORS is properly configured for production domains
- [ ] Rate limiting is enabled
- [ ] Security headers are configured (Helmet)

### 3. Performance
- [ ] Bundle size optimized with code splitting
- [ ] Images optimized and using CDN (Cloudinary)
- [ ] Database indexes are properly set
- [ ] Service worker enabled for caching

### 4. Monitoring
- [ ] Error logging configured
- [ ] Performance monitoring set up
- [ ] Database monitoring enabled

## 📋 Deployment Steps

### Development Setup
1. Ensure `.env` files are configured for development:
   - Server: `NODE_ENV=development`, `CLIENT_URL=http://localhost:3000`
   - Client: `VITE_API_URL=http://localhost:5000/api`
2. Start development servers:
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

### Client (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_URL=https://your-api-domain.vercel.app/api`
3. Deploy from main branch

### Server (Vercel)
1. Deploy server to Vercel
2. Set environment variables in Vercel dashboard:
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-client-domain.vercel.app`
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-jwt-secret`
   - `CLOUDINARY_CLOUD_NAME=your-cloudinary-name`
   - `CLOUDINARY_API_KEY=your-cloudinary-key`
   - `CLOUDINARY_API_SECRET=your-cloudinary-secret`
   - `EMAIL_SERVICE=gmail`
   - `EMAIL_USER=your-email`
   - `EMAIL_PASSWORD=your-app-password`

### Post-Deployment
1. Update client environment variable with actual server URL
2. Test all functionality
3. Monitor error logs
4. Set up domain names if needed

## 🔧 Production Configuration

### Database
- MongoDB Atlas with production cluster
- Connection pooling enabled
- Proper indexes for performance

### CDN & Assets
- Cloudinary for image uploads and optimization
- Static assets served from Vercel CDN

### Email Service
- Gmail SMTP with app-specific password
- Fallback error handling for email failures

### Security
- HTTPS enforced
- CORS properly configured
- Rate limiting enabled
- Input validation and sanitization
- Helmet security headers

## 🚨 Important Notes

1. **Never commit .env files to git**
2. **Use environment variables for all sensitive data**
3. **Test thoroughly before going live**
4. **Monitor performance and errors after deployment**
5. **Keep dependencies updated**
6. **Clear browser cache after deployment**
7. **Service worker is disabled in development to prevent issues**

## 🔧 Troubleshooting

If you encounter module loading errors:
1. Clear browser cache and hard refresh (Ctrl+Shift+R)
2. Check Vercel build logs for errors
3. Verify environment variables are set correctly
4. See `TROUBLESHOOTING.md` for detailed solutions

## 📞 Support

If you encounter any issues during deployment, check:
1. Vercel deployment logs
2. Browser console for client errors
3. Network tab for API call failures
4. Database connection status
