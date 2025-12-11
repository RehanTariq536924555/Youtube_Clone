# Supabase Database Deployment Guide

## Database Configuration

Your Supabase PostgreSQL database is configured with:
- **URL**: `postgresql://postgres.iyfxkudotvedmqhleioc:db_youtube_clone_pw@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`
- **Region**: Asia Pacific (Tokyo) - ap-northeast-1

## Quick Setup Steps

### 1. Test Database Connection
```bash
node setup-supabase-db.js
```

### 2. Update Environment Variables

For **local development** with Supabase:
```bash
cp .env.supabase .env
```

For **production deployment** (Render/Vercel/etc):
Set these environment variables:
```
DATABASE_URL=postgresql://postgres.iyfxkudotvedmqhleioc:db_youtube_clone_pw@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
JWT_SECRET=5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm
```

### 3. Start Your Application
```bash
npm run start:prod
```

## Database Schema

Your NestJS application will automatically:
- ✅ Create all required tables
- ✅ Set up relationships
- ✅ Handle migrations
- ✅ Use SSL connections

## Tables Created Automatically

The following tables will be created when your app starts:
- `users` - User accounts and profiles
- `videos` - Video metadata and files
- `comments` - Video comments
- `likes` - Video and comment likes
- `subscriptions` - Channel subscriptions
- `views` - Video view tracking
- `watch_later` - Watch later playlists
- `downloads` - Download tracking
- `settings` - Application settings
- `channels` - User channels
- `playlists` - Custom playlists

## Security Features

✅ **SSL Connection**: Automatically enabled for production
✅ **Connection Pooling**: Built-in with Supabase
✅ **Retry Logic**: 3 attempts with 3-second delays
✅ **Environment Isolation**: Separate configs for dev/prod

## Troubleshooting

### Connection Issues
1. Verify the DATABASE_URL is correct
2. Check Supabase dashboard for database status
3. Ensure your IP is whitelisted (if applicable)

### Table Creation Issues
1. Check application logs during startup
2. Verify `synchronize: true` in TypeORM config
3. Ensure proper entity imports

### Performance Optimization
1. Monitor connection pool usage in Supabase dashboard
2. Consider adding database indexes for frequently queried fields
3. Use Supabase's built-in monitoring tools

## Next Steps

1. **Deploy Backend**: Use the updated `.env.production` file
2. **Update Frontend**: Point to your deployed backend URL
3. **Configure OAuth**: Update Google OAuth callback URLs
4. **Monitor**: Use Supabase dashboard for database monitoring

## Environment Variables Summary

```env
# Required for Supabase
DATABASE_URL=postgresql://postgres.iyfxkudotvedmqhleioc:db_youtube_clone_pw@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
NODE_ENV=production
JWT_SECRET=5YrmFRKZSFLiWc23dh4LNHLkvHALQYchjTjP82jpDybhm

# Optional (keep your existing values)
EMAIL_USER=r66222562@gmail.com
EMAIL_PASS=dltkddxlzazhhpcu
GOOGLE_CLIENT_ID=321814641348-m4j1vkn468pjkac7oo4ug9tqaiacgc0m.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```