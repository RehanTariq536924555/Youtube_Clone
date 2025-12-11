# Complete Deployment Guide: Supabase Database + Render Backend

## 🎯 Overview
- **Database**: Supabase PostgreSQL (Already configured ✅)
- **Backend**: Render Web Service
- **Advantages**: Free tiers, excellent performance, easy scaling

## 📋 Pre-Deployment Checklist

### ✅ Database Ready
- Supabase database URL: `postgresql://postgres.iyfxkudotvedmqhleioc:***@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`
- Connection tested and working
- Tables will be created automatically by NestJS

## 🚀 Step-by-Step Render Deployment

### Step 1: Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Verify the `Backend` folder contains all necessary files

### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```
Name: nebulastream-backend
Region: Oregon (US-West)
Branch: main
Root Directory: Backend
Runtime: Node
Build Command: npm ci && npm run build
Start Command: npm run start:prod
```

### Step 3: Environment Variables
Copy these variables to Render Environment tab:

```env
DATABASE_URL=postgresql://postgres.iyfxkudotvedmqhleioc:db_youtube_clone_pw@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
PORT=4000
JWT_SECRET=5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm
JWT_EXPIRATION_TIME=3600s
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
App_NAME=NebulaStream_App
EMAIL_USER=r66222562@gmail.com
EMAIL_PASS=dltkddxlzazhhpcu
EMAIL_SECURE=false
GOOGLE_CLIENT_ID=321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://YOUR_SERVICE_NAME.onrender.com/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
AUTO_VERIFY_EMAIL=false
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`

## 🔧 Post-Deployment Configuration

### Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-service-name.onrender.com/auth/google/callback
   ```

### Test Your Deployment
1. Visit: `https://your-service-name.onrender.com/health` (if you have a health endpoint)
2. Check logs in Render dashboard
3. Verify database tables are created automatically

## 🎯 Advantages of This Setup

### Supabase Benefits
- ✅ **Free Tier**: 500MB database, 2GB bandwidth
- ✅ **Global CDN**: Fast worldwide access
- ✅ **Auto-scaling**: Handles traffic spikes
- ✅ **Built-in Auth**: Can extend with Supabase Auth later
- ✅ **Real-time**: WebSocket support available
- ✅ **Dashboard**: Visual database management

### Render Benefits
- ✅ **Free Tier**: 750 hours/month
- ✅ **Auto-deploy**: Git push triggers deployment
- ✅ **SSL**: Automatic HTTPS certificates
- ✅ **Logs**: Built-in logging and monitoring
- ✅ **Scaling**: Easy upgrade to paid plans

## 🔍 Monitoring & Maintenance

### Database Monitoring
- **Supabase Dashboard**: Monitor queries, connections, storage
- **URL**: https://supabase.com/dashboard/project/iyfxkudotvedmqhleioc

### Backend Monitoring
- **Render Dashboard**: View logs, metrics, deployments
- **Health Checks**: Set up custom health endpoints

## 🚨 Troubleshooting

### Common Issues

**1. Cold Starts (Free Tier)**
- Services sleep after 15 minutes
- First request may take 30+ seconds
- **Solution**: Upgrade to paid plan or use uptime monitoring

**2. Database Connection Errors**
```
Error: connect ECONNREFUSED
```
- **Check**: DATABASE_URL is correct
- **Verify**: Supabase database is active
- **Test**: Run `node setup-supabase-db.js` locally

**3. CORS Issues**
```
Access to fetch blocked by CORS policy
```
- **Update**: FRONTEND_URL environment variable
- **Check**: Your frontend domain is correct

**4. OAuth Callback Errors**
```
redirect_uri_mismatch
```
- **Update**: Google OAuth settings
- **Add**: Your Render URL to authorized redirects

### Debug Commands
```bash
# Test database connection
node setup-supabase-db.js

# Check environment variables
npm run start:dev

# View production logs
# (Check Render dashboard)
```

## 💰 Cost Breakdown

### Free Tier Limits
- **Supabase**: 500MB DB, 2GB bandwidth, 50MB file storage
- **Render**: 750 hours/month, 512MB RAM, shared CPU

### Upgrade Path
- **Supabase Pro**: $25/month (8GB DB, 250GB bandwidth)
- **Render Starter**: $7/month (always-on, 512MB RAM)

## 🎉 Success Checklist

- [ ] Render service deployed successfully
- [ ] Database connection working
- [ ] Environment variables configured
- [ ] Google OAuth updated
- [ ] API endpoints responding
- [ ] Frontend can connect to backend
- [ ] Email functionality working
- [ ] File uploads working (if applicable)

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **NestJS Docs**: https://docs.nestjs.com/

Your deployment is ready! 🚀