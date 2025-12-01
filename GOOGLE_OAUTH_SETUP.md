# Google OAuth Setup Guide

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:4000/auth/google/callback` (for development)
     - Add your production URL when deploying
   - Copy the Client ID and Client Secret

## 2. Environment Variables

Update your `Backend/.env` file with your Google OAuth credentials:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```

Update your `nebulastream/services/authService.ts` file:
- Replace `GOOGLE_CLIENT_ID = 'your_google_client_id_here'` with your actual Client ID

## 3. Database Migration

Run the following SQL commands in your PostgreSQL database to add Google OAuth support:

```sql
-- Add Google OAuth fields to user table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "googleId" varchar,
ADD COLUMN IF NOT EXISTS "picture" varchar;

-- Make password nullable for Google OAuth users
ALTER TABLE "user" 
ALTER COLUMN "password" DROP NOT NULL;
```

Or run the migration script:
```bash
node Backend/run-google-migration.js
```

## 4. Testing

1. Start your backend: `npm run start:dev` (in Backend directory)
2. Start your frontend: `npm run dev` (in nebulastream directory)
3. Navigate to `http://localhost:3000`
4. Click "Continue with Google" to test the OAuth flow

## 5. Production Deployment

When deploying to production:
1. Update the `GOOGLE_CALLBACK_URL` in your .env file
2. Add the production callback URL to your Google Cloud Console OAuth settings
3. Update the `FRONTEND_URL` environment variable
4. Ensure HTTPS is enabled for production OAuth

## Features Implemented

✅ Google OAuth 2.0 authentication
✅ Automatic user creation from Google profile
✅ JWT token generation
✅ Redirect-based auth flow (like YouTube)
✅ User profile with Google avatar
✅ Simplified auth UI (Google-only)

## Removed Features

❌ Email/password authentication
❌ Email verification
❌ Password reset
❌ Manual signup form

The app now works exactly like YouTube - users can only sign in with Google accounts.