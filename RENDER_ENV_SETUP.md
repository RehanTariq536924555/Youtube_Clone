# Render Environment Variables Setup

## Required Environment Variables for Render Deployment

Add these environment variables in your Render web service settings:

### Database Configuration
```
DATABASE_URL=postgresql://username:password@host:port/database
```
OR individually:
```
DB_HOST=your-postgres-host.render.com
DB_PORT=5432
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
```

### Application Configuration
```
PORT=4000
NODE_ENV=production
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

### Google OAuth
```
GOOGLE_CLIENT_ID=321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=https://your-service-name.onrender.com/auth/google/callback
```

### Frontend URL
```
FRONTEND_URL=https://your-frontend-domain.com
```

## Steps to Configure:

1. Create PostgreSQL database on Render
2. Copy the database connection details
3. Go to your web service → Environment tab
4. Add all the above environment variables
5. Update GOOGLE_CALLBACK_URL with your actual Render service URL
6. Update FRONTEND_URL with your frontend domain
7. Redeploy the service

## Alternative: Use DATABASE_URL

If your PostgreSQL service provides a DATABASE_URL, you can use that instead of individual DB_* variables.