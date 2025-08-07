# Troubleshooting Guide

## 🐛 Common Issues and Solutions

This guide covers common issues you might encounter while setting up or running BlogVerse, along with step-by-step solutions.

## Database Connection Issues

### Issue: Cannot Connect to MongoDB

**Error Messages:**

```
MongoNetworkError: failed to connect to server
MongooseServerSelectionError: connect ECONNREFUSED
```

#### For Local MongoDB:

1. **Check if MongoDB service is running:**

   ```bash
   # Windows
   net start MongoDB

   # macOS (using Homebrew)
   brew services start mongodb/brew/mongodb-community

   # Linux (systemd)
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is listening on correct port:**

   ```bash
   netstat -an | grep 27017
   # Should show: 127.0.0.1:27017
   ```

3. **Check MongoDB logs:**
   ```bash
   # Windows: Check Event Viewer or MongoDB log files
   # macOS/Linux:
   sudo tail -f /var/log/mongodb/mongod.log
   ```

#### For MongoDB Atlas:

1. **Verify connection string:**

   - Ensure username/password are correct
   - Check database name in connection string
   - Verify cluster is running

2. **Check IP whitelist:**

   - Add your current IP address
   - For development, you can use `0.0.0.0/0` (not recommended for production)

3. **Test connection string:**
   ```bash
   # Use MongoDB Compass or mongosh to test
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/blogverse"
   ```

### Issue: Authentication Failed

**Error Message:**

```
MongoServerError: Authentication failed
```

**Solutions:**

1. **Check credentials in .env file**
2. **Ensure user has proper permissions** (readWrite access)
3. **Verify database name** in connection string
4. **Check if user exists** in MongoDB Atlas dashboard

## Email Service Issues

### Issue: Emails Not Sending

**Error Messages:**

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
Error: connect ETIMEDOUT
```

#### For Gmail:

1. **Enable 2-Factor Authentication:**

   - Go to Google Account settings
   - Security → 2-Step Verification → Enable

2. **Generate App Password:**

   - In Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `EMAIL_PASSWORD`, not your regular password

3. **Check Less Secure App Access** (if not using App Password):
   - This is deprecated but might be needed for older setups
   - Not recommended for security reasons

#### For Other Email Providers:

1. **SMTP Settings:**

   ```env
   EMAIL_SERVICE=smtp
   EMAIL_HOST=smtp.yourdomain.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@domain.com
   EMAIL_PASSWORD=your-password
   ```

2. **Common SMTP Settings:**
   - **Outlook:** smtp.live.com, port 587
   - **Yahoo:** smtp.mail.yahoo.com, port 587
   - **Custom:** Check with your provider

### Issue: OTP Emails Delayed

**Solutions:**

1. **Check spam folder**
2. **Verify email service limits** (Gmail: 500 emails/day for free accounts)
3. **Implement email queue** for high-volume sending
4. **Check email service status** (Gmail, Outlook status pages)

## Image Upload Issues

### Issue: Cloudinary Upload Failures

**Error Messages:**

```
Error: Invalid cloud_name
Error: Upload failed - Invalid API key
Error: File too large
```

**Solutions:**

1. **Verify Cloudinary Credentials:**

   ```env
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=your-actual-api-key
   CLOUDINARY_API_SECRET=your-actual-api-secret
   ```

2. **Check File Size Limits:**

   - Default limit: 5MB
   - Increase limit in backend if needed:

   ```javascript
   app.use(
     fileUpload({
       limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
     })
   );
   ```

3. **Verify File Types:**

   - Ensure only supported formats: jpg, jpeg, png, gif, webp
   - Check MIME type validation in upload middleware

4. **Test Cloudinary Connection:**
   ```javascript
   // Add this test endpoint temporarily
   app.get("/test-cloudinary", async (req, res) => {
     try {
       const result = await cloudinary.api.ping();
       res.json({ status: "success", result });
     } catch (error) {
       res.json({ status: "error", error: error.message });
     }
   });
   ```

## CORS (Cross-Origin) Issues

### Issue: CORS Policy Errors

**Error Message:**

```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solutions:**

1. **Check ALLOWED_ORIGINS in server .env:**

   ```env
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   CLIENT_URL=http://localhost:5173
   ```

2. **Verify CORS middleware configuration:**

   ```javascript
   // server.js
   app.use(
     cors({
       origin:
         process.env.ALLOWED_ORIGINS?.split(",") || "http://localhost:5173",
       credentials: true,
     })
   );
   ```

3. **Check API endpoint URLs in frontend:**

   ```env
   # client/.env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **For production deployment:**
   - Update ALLOWED_ORIGINS with production URLs
   - Ensure HTTPS is used for production

## JWT Token Issues

### Issue: Authentication Failures

**Error Messages:**

```
JsonWebTokenError: invalid token
JsonWebTokenError: jwt expired
JsonWebTokenError: jwt malformed
```

**Solutions:**

1. **Check JWT_SECRET:**

   ```env
   # Must be at least 32 characters long
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
   ```

2. **Clear browser storage:**

   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   // Or check Application tab in DevTools
   ```

3. **Check token format:**

   ```javascript
   // Token should be in format: Bearer <token>
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Verify token expiration:**
   - Default expiration: 24 hours
   - Check server logs for token validation errors

## Development Environment Issues

### Issue: Hot Reload Not Working

**For Vite (Frontend):**

1. **Clear cache:**

   ```bash
   rm -rf node_modules/.cache
   npm run dev
   ```

2. **Check file watching limits (Linux):**

   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

3. **Restart development server:**
   ```bash
   # Kill any existing processes
   lsof -ti:5173 | xargs kill -9
   npm run dev
   ```

**For Nodemon (Backend):**

1. **Check nodemon configuration:**

   ```json
   // package.json
   {
     "scripts": {
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Restart with debug:**
   ```bash
   npx nodemon --inspect server.js
   ```

### Issue: Port Already in Use

**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

1. **Find and kill process using the port:**

   ```bash
   # Find process
   lsof -ti:5000
   netstat -ano | findstr :5000  # Windows

   # Kill process
   kill -9 $(lsof -ti:5000)      # macOS/Linux
   taskkill /PID <PID> /F        # Windows
   ```

2. **Use different port:**
   ```env
   PORT=5001
   ```

## Build and Deployment Issues

### Issue: Build Failures

**Frontend Build Issues:**

1. **Clear node_modules and reinstall:**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check TypeScript errors:**

   ```bash
   npx tsc --noEmit
   ```

3. **Verify environment variables:**
   ```env
   # Ensure all VITE_ prefixed variables exist
   VITE_API_URL=your-api-url
   ```

**Backend Build Issues:**

1. **Check Node.js version:**

   ```bash
   node --version  # Should be v16 or higher
   ```

2. **Verify all dependencies installed:**
   ```bash
   npm list --depth=0
   ```

### Issue: Deployment Environment Variables

**Solutions:**

1. **Verify all environment variables are set** in deployment platform
2. **Check variable names** (no typos)
3. **Ensure sensitive variables** are not exposed to client
4. **Test deployment environment** with staging first

## Performance Issues

### Issue: Slow API Responses

**Diagnostic Steps:**

1. **Check database query performance:**

   ```javascript
   // Add query logging
   mongoose.set("debug", true);
   ```

2. **Monitor API response times:**

   ```javascript
   // Add timing middleware
   app.use((req, res, next) => {
     const start = Date.now();
     res.on("finish", () => {
       console.log(`${req.method} ${req.path}: ${Date.now() - start}ms`);
     });
     next();
   });
   ```

3. **Check database indexes:**
   ```javascript
   // In MongoDB shell
   db.blogs.getIndexes();
   db.blogs.explain("executionStats").find({ category: "Technology" });
   ```

### Issue: High Memory Usage

**Solutions:**

1. **Check for memory leaks:**

   ```bash
   node --inspect server.js
   # Use Chrome DevTools Memory tab
   ```

2. **Monitor memory usage:**
   ```javascript
   setInterval(() => {
     const usage = process.memoryUsage();
     console.log("Memory usage:", usage);
   }, 60000);
   ```

## Browser-Specific Issues

### Issue: Features Not Working in Safari

**Common Safari Issues:**

1. **Date parsing differences:**

   ```javascript
   // Use this format instead of new Date("2023-01-01")
   const date = new Date("2023/01/01");
   ```

2. **Local storage limitations:**
   - Check if localStorage is available
   - Handle private browsing mode

### Issue: Internet Explorer Compatibility

**Solutions:**

1. **Add polyfills:**

   ```bash
   npm install --save-dev @vitejs/plugin-legacy
   ```

2. **Use Babel for older syntax support**

## Testing Environment Issues

### Issue: Tests Failing

**Solutions:**

1. **Check test environment variables:**

   ```env
   NODE_ENV=test
   MONGODB_URI=mongodb://localhost:27017/blogverse_test
   ```

2. **Clear test database:**
   ```javascript
   // In test setup
   beforeEach(async () => {
     await mongoose.connection.db.dropDatabase();
   });
   ```

## Getting Additional Help

### Debug Information to Collect

When reporting issues, please provide:

1. **Environment Information:**

   ```bash
   node --version
   npm --version
   cat package.json | grep version
   ```

2. **Error Logs:**

   - Complete error messages
   - Stack traces
   - Browser console errors
   - Server console logs

3. **Configuration:**
   - Environment variables (without sensitive data)
   - Package.json dependencies
   - Browser and OS information

### Diagnostic Commands

```bash
# Check all services status
npm run check-health  # Custom script to check DB, API, etc.

# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.log('❌ Database error:', err.message));
"

# Test API endpoints
curl -X GET http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Community Resources

- **GitHub Issues:** Check existing issues and solutions
- **Stack Overflow:** Search for similar problems
- **Documentation:** Review API reference and setup guides
- **Discord/Slack:** Join community discussions (if available)

## Prevention Tips

1. **Regular Updates:**

   ```bash
   npm audit fix
   npm update
   ```

2. **Environment Consistency:**

   - Use Docker for consistent environments
   - Document all setup steps
   - Version lock important dependencies

3. **Monitoring:**

   - Set up application monitoring
   - Log important events
   - Monitor resource usage

4. **Backup Strategy:**
   - Regular database backups
   - Environment variable backups
   - Code repository backups
