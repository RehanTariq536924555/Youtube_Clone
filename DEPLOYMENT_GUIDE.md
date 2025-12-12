# Render Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. "Cannot HEAD /" or "Cannot GET /" Errors

**Problem**: Render performs health checks on your application, but the routes aren't properly configured.

**Solution**: ✅ **FIXED** - Updated `app.controller.ts` to handle HEAD requests:
- Added `@Head()` decorators for root and health endpoints
- Added proper response handling for favicon requests
- Updated CORS configuration to include production URLs

### 2. Environment Variables

Make sure these environment variables are set in your Render service:

**Required Variables:**
```
NODE_ENV=production
PORT=4000
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://youtube-clone-frontend-livid.vercel.app
```

**Email Configuration:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

**Google OAuth:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-render-url.onrender.com/auth/google/callback
```

### 3. Build Configuration

**render.yaml** is configured with:
- ✅ Health check path: `/health`
- ✅ Node.js version: 22
- ✅ Production build process
- ✅ Proper start command

### 4. Database Connection

Make sure your Supabase database is:
- ✅ Accessible from external connections
- ✅ Connection string is correct in `DATABASE_URL`
- ✅ Database tables are created (run migrations if needed)

### 5. CORS Configuration

Updated CORS to allow:
- ✅ Your Vercel frontend URL
- ✅ Your Render backend URL
- ✅ Local development URLs
- ✅ HEAD requests for health checks

## Deployment Steps

1. **Push to GitHub**: Make sure all changes are committed and pushed
2. **Render Auto-Deploy**: Render will automatically deploy from your GitHub repo
3. **Check Logs**: Monitor the deployment logs in Render dashboard
4. **Test Health Check**: Visit `https://your-app.onrender.com/health`
5. **Test API**: Try accessing your API endpoints

## Health Check Endpoints

- `GET /` - Basic health check
- `GET /health` - Detailed health check with uptime
- `HEAD /` - For Render health checks
- `HEAD /health` - Alternative health check

## Troubleshooting Commands

If you need to debug locally:

```bash
# Build the project
npm run build

# Start in production mode
npm run start:prod

# Test health endpoint
curl http://localhost:4000/health
```

## Common Error Messages and Solutions

### "Cannot HEAD /"
- ✅ **FIXED**: Added HEAD route handlers

### "CORS Error"
- ✅ **FIXED**: Updated CORS configuration with production URLs

### "Database Connection Error"
- Check `DATABASE_URL` environment variable
- Verify Supabase connection string
- Check if database is accessible

### "Port Already in Use"
- Render automatically assigns the PORT environment variable
- Make sure your app uses `process.env.PORT`

## Monitoring

After deployment, monitor:
1. **Render Logs**: Check for any runtime errors
2. **Health Check**: Ensure `/health` endpoint responds
3. **Database**: Verify database connections work
4. **Frontend Integration**: Test API calls from your frontend

## Support

If issues persist:
1. Check Render service logs
2. Verify all environment variables are set
3. Test the health check endpoint
4. Check database connectivity