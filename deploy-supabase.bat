@echo off
echo 🚀 Deploying to Supabase...

echo.
echo 📋 Step 1: Testing Supabase connection...
node setup-supabase-db.js

if %errorlevel% neq 0 (
    echo ❌ Database connection failed!
    pause
    exit /b 1
)

echo.
echo 📋 Step 2: Copying Supabase environment...
copy .env.supabase .env

echo.
echo 📋 Step 3: Installing dependencies...
npm install

echo.
echo 📋 Step 4: Building application...
npm run build

echo.
echo 📋 Step 5: Starting application...
echo ✅ Ready to start! Run: npm run start:prod
echo.
echo 🌐 Your Supabase database is ready at:
echo    postgresql://postgres.iyfxkudotvedmqhleioc:***@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
echo.
echo 📖 Next steps:
echo    1. Deploy your backend to Render/Vercel/Railway
echo    2. Update FRONTEND_URL and GOOGLE_CALLBACK_URL
echo    3. Deploy your frontend
echo.
pause