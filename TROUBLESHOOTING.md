# Deployment Troubleshooting Guide

## 🚨 Common Deployment Issues and Solutions

### 1. Module Script MIME Type Error
**Error:** `Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"`

**Causes & Solutions:**
- **Build Issues:** Ensure you've run `npm run build` before deploying
- **Static Asset Serving:** Make sure Vercel is serving your built files correctly
- **Path Issues:** Check that your routes are properly configured in `vercel.json`

**Fix Steps:**
1. Clear browser cache and service worker
2. Rebuild the project: `npm run build`
3. Redeploy to Vercel
4. Check Network tab for any 404s on JS/CSS files

### 2. Service Worker Issues
**Error:** Service worker installation/activation errors

**Solutions:**
- Service worker is now disabled in development
- Only runs in production (`import.meta.env.PROD`)
- Clear all browser data if issues persist

**Manual Fix:**
```javascript
// In browser console, unregister service worker:
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### 3. Environment Variables
**Issue:** API calls failing or incorrect URLs

**Solutions:**
1. Development: Use `.env` with `VITE_API_URL=http://localhost:5000/api`
2. Production: Set environment variables in Vercel dashboard

### 4. CORS Issues
**Error:** Cross-origin request blocked

**Solutions:**
- Ensure server `.env` has correct `CLIENT_URL`
- Check CORS configuration in `server.js`
- Verify both client and server are deployed

### 5. Build Optimization Issues
**Error:** Bundle size warnings or chunk loading errors

**Solutions:**
- Code splitting is configured in `vite.config.ts`
- Terser minification enabled for production
- Manual chunks for vendor libraries

## 🔧 Quick Fixes

### Clear All Cache
```bash
# Browser
- Hard refresh (Ctrl+Shift+R)
- Clear all browser data
- Disable service worker in DevTools

# Build
rm -rf dist node_modules
npm install
npm run build
```

### Verify Deployment
1. Check Vercel build logs
2. Test API endpoints directly
3. Verify environment variables
4. Check Network tab in DevTools

### Debug Steps
1. **Check Console:** Look for specific error messages
2. **Network Tab:** Check for failed requests
3. **Sources Tab:** Verify files are loading correctly
4. **Application Tab:** Check service worker status

## 📞 Emergency Fixes

If deployment is completely broken:

1. **Disable Service Worker:**
   ```javascript
   // Comment out service worker registration in main.tsx
   ```

2. **Simplify Build:**
   ```javascript
   // In vite.config.ts, remove optimizations temporarily
   ```

3. **Basic Vercel Config:**
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

## ✅ Production Checklist

Before deploying:
- [ ] `npm run build` runs without errors
- [ ] Environment variables set in Vercel
- [ ] Service worker disabled in development
- [ ] API URLs point to production server
- [ ] CORS configured for production domains
- [ ] Static assets loading correctly
