# Complete Admin Setup Guide for NebulaStream

## Current Status ✅

1. **User Created**: `admin@nebulastream.com` has been created in your database
2. **User ID**: `3ddfa24b-aea6-4fb9-84a7-9582960554ab`
3. **Current Role**: `user` (needs to be promoted to `admin`)

## Quick Solution (Recommended)

### Option 1: Use the Promotion Endpoint (After Deployment)

Wait 2-3 minutes for the latest deployment to complete, then run:

```bash
curl -X POST https://youtube-clone-1-ntn4.onrender.com/bootstrap/promote-to-admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@nebulastream.com"}'
```

Or use the script:
```bash
node promote-to-admin.js
```

### Option 2: Manual Database Update

If you have access to your PostgreSQL database, run this SQL:

```sql
UPDATE "user" SET role = 'admin', "isEmailVerified" = true 
WHERE email = 'admin@nebulastream.com';
```

### Option 3: Use Render Database Console

1. Go to your Render dashboard
2. Navigate to your PostgreSQL database
3. Open the "Query" tab
4. Run the SQL from Option 2

## Login Credentials

Once promoted to admin:

- **Email**: `admin@nebulastream.com`
- **Password**: Use Google OAuth (recommended) or set a password

## Testing Admin Access

1. **Frontend Login**: Go to your frontend application and login with Google OAuth using `admin@nebulastream.com`
2. **Admin Panel**: Access admin features through your application
3. **API Test**: Test admin endpoints with the user's JWT token

## Verification Steps

After promotion, verify admin access:

```bash
# Get user token first (via Google OAuth or login)
# Then test admin endpoint:
curl -X GET https://youtube-clone-1-ntn4.onrender.com/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### If promotion endpoint returns 404:
- Wait for deployment to complete (2-3 minutes)
- Check if the endpoint is available: `https://youtube-clone-1-ntn4.onrender.com/bootstrap/promote-to-admin`

### If "Admin user already exists" error:
- An admin has already been created
- Try logging in with existing admin credentials
- Check database for existing admin users

### If login fails:
- Use Google OAuth instead of password
- Ensure email is verified in database
- Check user role is set to 'admin'

## Security Notes

- The bootstrap endpoints only work when no admin exists
- After first admin is created, these endpoints are automatically disabled
- Change default passwords immediately after first login
- Consider enabling 2FA for admin accounts

## Database Schema Reference

User table structure:
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR,
  role VARCHAR DEFAULT 'user',
  "isEmailVerified" BOOLEAN DEFAULT false,
  "googleId" VARCHAR,
  picture VARCHAR,
  -- ... other fields
);
```

## Next Steps

1. ✅ User created: `admin@nebulastream.com`
2. 🔄 Promote to admin (run promotion script)
3. 🔐 Login and test admin access
4. 🛡️ Secure the admin account
5. 🎉 Start using the admin panel!

---

**Current User Details:**
- ID: `3ddfa24b-aea6-4fb9-84a7-9582960554ab`
- Email: `admin@nebulastream.com`
- Name: `Admin User`
- Role: `user` → needs promotion to `admin`
- Created: `2025-12-12T15:14:09.446Z`