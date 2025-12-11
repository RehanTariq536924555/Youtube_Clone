# Deployment Guide for Render

## Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)

## Step-by-Step Deployment

### 1. Database Setup
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Name: `youtube-clone-db`
4. Database Name: `YoutubeClone`
5. User: `postgres`
6. Region: Oregon (or your preferred region)
7. Plan: Free
8. Click "Create Database"
9. Save the connection details (Internal Database URL)

### 2. Backend Service Setup
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `Youtube_Clone`
5. Configure:
   - Name: `youtube-clone-backend`
   - Region: Oregon
   - Branch: `main`
   - Root Directory: `Backend`
   - Runtime: Node
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm run start:prod`

### 3. Environment Variables
Add these environment variables in Render:

```
NODE_ENV=production
PORT=4000
DB_HOST=[Your PostgreSQL Internal Host from step 1]
DB_PORT=5432
DB_USERNAME=[Your PostgreSQL Username from step 1]
DB_PASSWORD=[Your PostgreSQL Password from step 1]
DB_NAME=YoutubeClone
JWT_SECRET=5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm
JWT_EXPIRATION_TIME=3600s
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
App_NAME=NebulaStream_App
EMAIL_USER=r66222562@gmail.com
EMAIL_PASS=dltkddxlzazhhpcu
EMAIL_SECURE=false
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CLIENT_ID=321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://your-backend-service.onrender.com/auth/google/callback
AUTO_VERIFY_EMAIL=false
```

### 4. Update Google OAuth Settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your Render backend URL to authorized redirect URIs:
   - `https://your-backend-service.onrender.com/auth/google/callback`

### 5. Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your backend will be available at: `https://your-service-name.onrender.com`

## Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- 750 hours/month limit
- Cold starts may take 30+ seconds

### Database Connection
- Use the Internal Database URL for better performance
- Format: `postgresql://username:password@host:port/database`

### CORS Configuration
Update your frontend URL in the environment variables once deployed.

### Monitoring
- Check logs in Render dashboard
- Monitor database usage
- Set up health checks if needed

## Troubleshooting

### Common Issues
1. **Build Failures**: Check Node.js version compatibility
2. **Database Connection**: Verify connection string format
3. **CORS Errors**: Update FRONTEND_URL environment variable
4. **Cold Starts**: Consider upgrading to paid plan for always-on service

### Logs
Access logs through Render dashboard → Your Service → Logs tab