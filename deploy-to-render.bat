@echo off
REM 🚀 Quick Render Deployment Script for Windows
REM This script helps you deploy your chat application to Render

echo 🚀 Starting Render Deployment Process...

REM Check if git is initialized
if not exist ".git" (
    echo [ERROR] Git repository not initialized. Please run 'git init' first.
    pause
    exit /b 1
)

REM Check if remote origin is set
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [ERROR] No remote origin found. Please add your GitHub repository as origin.
    echo Run: git remote add origin https://github.com/MAHIMAJYOTI/chatapp.git
    pause
    exit /b 1
)

echo [INFO] Checking repository status...

REM Check if there are uncommitted changes and commit them
git diff-index --quiet HEAD --
if errorlevel 1 (
    echo [WARNING] You have uncommitted changes. Committing them now...
    git add .
    git commit -m "Deploy: Update for Render deployment"
)

REM Push to GitHub
echo [INFO] Pushing latest changes to GitHub...
git push origin master

if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub. Please check your git configuration.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Code pushed to GitHub successfully!
)

echo.
echo 🎯 Next Steps for Render Deployment:
echo.
echo 1. 📊 Backend Deployment:
echo    - Go to: https://dashboard.render.com
echo    - Click 'New' → 'Web Service'
echo    - Connect GitHub repo: MAHIMAJYOTI/chatapp
echo    - Configure:
echo      • Name: awsproject-backend
echo      • Environment: Node
echo      • Root Directory: backend
echo      • Build Command: npm install
echo      • Start Command: npm start
echo.
echo 2. 🎨 Frontend Deployment:
echo    - Click 'New' → 'Static Site'
echo    - Connect GitHub repo: MAHIMAJYOTI/chatapp
echo    - Configure:
echo      • Name: awsproject-frontend
echo      • Root Directory: jellylemonshake
echo      • Build Command: npm install --legacy-peer-deps ^&^& REACT_APP_API_URL=https://awsproject-backend.onrender.com npm run build
echo      • Publish Directory: build
echo.
echo 3. 🔧 Environment Variables:
echo    Backend:
echo    • NODE_ENV=production
echo    • PORT=10000
echo    • MONGODB_URI=mongodb+srv://awsproject:awsproject@awsproject.fvreojm.mongodb.net/?retryWrites=true&w=majority&appName=awsproject
echo    • JDOODLE_CLIENT_ID=your_jdoodle_client_id
echo    • JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
echo.
echo    Frontend:
echo    • REACT_APP_API_URL=https://awsproject-backend.onrender.com
echo    • NODE_ENV=production
echo.
echo 4. 🗄️ Database Setup:
echo    - Create MongoDB Atlas account (free)
echo    - Create cluster and get connection string
echo    - Add connection string to backend environment variables
echo.
echo 5. 🧪 Test Deployment:
echo    - Backend health: https://awsproject-backend.onrender.com/health
echo    - Frontend: https://awsproject-frontend.onrender.com
echo.
echo [SUCCESS] Deployment preparation complete! Follow the steps above to deploy on Render.
echo.
echo 📚 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md
echo.
pause
