@echo off
echo 🚀 Supabase + Render Deployment Helper
echo =====================================

echo.
echo 📋 Step 1: Testing Supabase Database Connection...
node setup-supabase-db.js

if %errorlevel% neq 0 (
    echo ❌ Database connection failed! Check your Supabase configuration.
    pause
    exit /b 1
)

echo.
echo ✅ Database connection successful!
echo.
echo 📋 Step 2: Deployment Checklist
echo.
echo ✅ Database: Supabase PostgreSQL (Ready)
echo    URL: postgresql://postgres.iyfxkudotvedmqhleioc:***@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
echo.
echo 📝 Next Steps for Render Deployment:
echo.
echo 1. Go to https://dashboard.render.com/
echo 2. Click "New" → "Web Service"
echo 3. Connect your GitHub repository
echo 4. Use these settings:
echo    - Name: nebulastream-backend
echo    - Root Directory: Backend
echo    - Build Command: npm ci ^&^& npm run build
echo    - Start Command: npm run start:prod
echo.
echo 5. Copy environment variables from: RENDER_ENVIRONMENT_VARIABLES.txt
echo.
echo 6. After deployment, update:
echo    - Google OAuth callback URL
echo    - Frontend URL in environment variables
echo.
echo 📖 Complete guide: SUPABASE_RENDER_DEPLOYMENT.md
echo.
echo 🎯 Your Supabase database is ready and waiting for your Render backend!
echo.
pause