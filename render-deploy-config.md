# Render Deployment Configuration

## Environment Variables to Add in Render Dashboard

Go to your Render Web Service → Environment tab and add these variables:

### Database Configuration
```
DATABASE_URL=postgresql://postgres:db_youtube_clone_pw@db.iyfxkudotvedmqhleioc.supabase.co:5432/postgres
```

### Application Settings
```
NODE_ENV=production
PORT=4000
```

### JWT Configuration
```
JWT_SECRET=5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm
JWT_EXPIRATION_TIME=3600s
```

### Email Configuration
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
App_NAME=NebulaStream_App
EMAIL_USER=r66222562@gmail.com
EMAIL_PASS=dltkddxlzazhhpcu
EMAIL_SECURE=false
```

### Google OAuth Configuration
```
GOOGLE_CLIENT_ID=321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://YOUR_SERVICE_NAME.onrender.com/auth/google/callback
```
*Replace YOUR_SERVICE_NAME with your actual Render service name*

### Optional Settings
```
FRONTEND_URL=https://your-frontend-domain.com
AUTO_VERIFY_EMAIL=false
```

## Steps to Deploy:

1. **Create PostgreSQL Database:**
   - New → PostgreSQL → Free tier
   - Copy the "Internal Database URL"

2. **Add Environment Variables:**
   - Go to Web Service → Environment
   - Add all variables above
   - Paste your DATABASE_URL

3. **Update Google OAuth:**
   - Replace YOUR_SERVICE_NAME in GOOGLE_CALLBACK_URL
   - Update your Google OAuth settings if needed

4. **Deploy:**
   - Save environment variables
   - Render will auto-deploy

## Current Status:
✅ Build issues fixed
✅ Import paths fixed  
✅ Database URL support added
✅ SSL configuration added
⏳ Need DATABASE_URL from your PostgreSQL service