# Create Admin User for NebulaStream

## Problem
You're getting "Unauthorized" when trying to access the admin panel with `admin@nebulastream.com` because this admin user doesn't exist in your production database yet.

## Solution
I've created a special bootstrap endpoint that allows you to create the first admin user without authentication.

## Steps to Create Admin User

### Option 1: Using curl (Recommended)

Open your terminal and run this command (replace with your actual Render URL):

```bash
curl -X POST https://youtube-clone-1-ntn4.onrender.com/admin/bootstrap/create-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@nebulastream.com",
    "password": "admin123"
  }'
```

### Option 2: Using Postman or any API client

**URL:** `POST https://youtube-clone-1-ntn4.onrender.com/admin/bootstrap/create-first-admin`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@nebulastream.com",
  "password": "admin123"
}
```

### Option 3: Using JavaScript in browser console

Open your browser console on any page and run:

```javascript
fetch('https://youtube-clone-1-ntn4.onrender.com/admin/bootstrap/create-first-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@nebulastream.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## Expected Response

If successful, you should see:
```json
{
  "message": "First admin created successfully",
  "user": {
    "id": "uuid-here",
    "name": "Admin User",
    "email": "admin@nebulastream.com",
    "role": "admin"
  }
}
```

## After Creating Admin

1. **Wait 2-3 minutes** for the deployment to complete
2. Go to your admin login page
3. Use these credentials:
   - **Email:** `admin@nebulastream.com`
   - **Password:** `admin123`

## Security Notes

- This bootstrap endpoint only works if NO admin users exist in the database
- Once an admin user exists, this endpoint will be disabled
- After creating the admin, you should change the password through the admin panel
- The bootstrap endpoint will automatically be secured after first use

## Troubleshooting

If you get an error saying "Admin user already exists":
- An admin user has already been created
- Try logging in with the existing credentials
- If you forgot the password, you can reset it through the regular password reset flow

## Alternative: Promote Existing User

If you already have a regular user account, the bootstrap endpoint can promote it to admin:
- Use the same email as your existing account
- The endpoint will upgrade your existing user to admin role
- Your existing data will be preserved