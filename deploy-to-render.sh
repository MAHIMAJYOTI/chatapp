#!/bin/bash

# 🚀 Quick Render Deployment Script
# This script helps you deploy your chat application to Render

echo "🚀 Starting Render Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if remote origin is set
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No remote origin found. Please add your GitHub repository as origin."
    echo "Run: git remote add origin https://github.com/MAHIMAJYOTI/chatapp.git"
    exit 1
fi

print_status "Checking repository status..."

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Deploy: Update for Render deployment"
fi

# Push to GitHub
print_status "Pushing latest changes to GitHub..."
git push origin master

if [ $? -eq 0 ]; then
    print_success "Code pushed to GitHub successfully!"
else
    print_error "Failed to push to GitHub. Please check your git configuration."
    exit 1
fi

echo ""
echo "🎯 Next Steps for Render Deployment:"
echo ""
echo "1. 📊 Backend Deployment:"
echo "   - Go to: https://dashboard.render.com"
echo "   - Click 'New' → 'Web Service'"
echo "   - Connect GitHub repo: MAHIMAJYOTI/chatapp"
echo "   - Configure:"
echo "     • Name: awsproject-backend"
echo "     • Environment: Node"
echo "     • Root Directory: backend"
echo "     • Build Command: npm install"
echo "     • Start Command: npm start"
echo ""
echo "2. 🎨 Frontend Deployment:"
echo "   - Click 'New' → 'Static Site'"
echo "   - Connect GitHub repo: MAHIMAJYOTI/chatapp"
echo "   - Configure:"
echo "     • Name: awsproject-frontend"
echo "     • Root Directory: jellylemonshake"
echo "     • Build Command: npm install --legacy-peer-deps && REACT_APP_API_URL=https://awsproject-backend.onrender.com npm run build"
echo "     • Publish Directory: build"
echo ""
echo "3. 🔧 Environment Variables:"
echo "   Backend:"
echo "   • NODE_ENV=production"
echo "   • PORT=10000"
echo "   • MONGODB_URI=mongodb+srv://awsproject:awsproject@awsproject.fvreojm.mongodb.net/?retryWrites=true&w=majority&appName=awsproject"
echo "   • JDOODLE_CLIENT_ID=your_jdoodle_client_id"
echo "   • JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret"
echo ""
echo "   Frontend:"
echo "   • REACT_APP_API_URL=https://awsproject-backend.onrender.com"
echo "   • NODE_ENV=production"
echo ""
echo "4. 🗄️ Database Setup:"
echo "   - Create MongoDB Atlas account (free)"
echo "   - Create cluster and get connection string"
echo "   - Add connection string to backend environment variables"
echo ""
echo "5. 🧪 Test Deployment:"
echo "   - Backend health: https://awsproject-backend.onrender.com/health"
echo "   - Frontend: https://awsproject-frontend.onrender.com"
echo ""
print_success "Deployment preparation complete! Follow the steps above to deploy on Render."
echo ""
echo "📚 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md"
