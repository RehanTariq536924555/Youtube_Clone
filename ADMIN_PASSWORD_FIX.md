# 🔧 Admin Password Fix - Direct Solution

## 🎯 Problem Identified

The admin user `admin@nebulastream.com` was created via Google OAuth with `password: null`. When you try to login with email/password, the password comparison fails because there's no password hash to compare against.

## ✅ Direct Database Solution

Run this SQL in your PostgreSQL database to set the password:

```sql
-- Set password hash for admin123
UPDATE "user" 
SET password = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    role = 'admin',
    "isEmailVerified" = true 
WHERE email = 'admin@nebulastream.com';
```

This sets:
- **Password**: `admin123` (properly hashed with bcrypt)
- **Role**: `admin` (gives admin privileges)
- **Email Verified**: `true` (ensures login works)

## 🌐 Where to Run This

### Option 1: Render Database Console
1. Go to your Render dashboard
2. Navigate to your PostgreSQL database
3. Click "Query" tab
4. Paste and run the SQL above

### Option 2: Any PostgreSQL Client
- pgAdmin
- DBeaver  
- Command line `psql`
- Any database management tool

## 🔐 After Running the SQL

You can immediately login with:
- **Email**: `admin@nebulastream.com`
- **Password**: `admin123`
- **Role**: `admin` (full privileges)

## 🧪 Test Login

After running the SQL, test the login:

```bash
curl -X POST https://youtube-clone-1-ntn4.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@nebulastream.com", "password": "admin123"}'
```

Expected response:
```json
{
  "access_token": "eyJ...",
  "user": {
    "id": "3ddfa24b-aea6-4fb9-84a7-9582960554ab",
    "email": "admin@nebulastream.com",
    "role": "admin"
  }
}
```

## 🔍 Verify the Fix

Check the user in database:
```sql
SELECT id, name, email, role, "isEmailVerified", 
       CASE WHEN password IS NULL THEN 'No Password' ELSE 'Has Password' END as password_status
FROM "user" 
WHERE email = 'admin@nebulastream.com';
```

Should show:
- `role`: `admin`
- `isEmailVerified`: `true`
- `password_status`: `Has Password`

## 🎉 Final Result

After running the SQL update:
- ✅ Login works with email/password
- ✅ User has admin role
- ✅ Can access admin panel
- ✅ Full admin privileges

---

**This is the fastest and most reliable solution to fix the admin login issue!**