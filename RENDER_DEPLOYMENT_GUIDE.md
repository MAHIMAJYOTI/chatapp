# 🚀 Complete Render Deployment Guide

## Prerequisites
- GitHub repository: `https://github.com/MAHIMAJYOTI/chatapp.git`
- MongoDB Atlas account (free tier)
- Render account (free tier available)

## Step 1: Prepare MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free M0 tier)

### 1.2 Configure Database Access
1. Go to "Database Access" → "Add New Database User"
2. Create a user with read/write permissions
3. Note down the username and password

### 1.3 Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Add `0.0.0.0/0` to allow access from anywhere (for Render)

### 1.4 Get Connection String
1. Go to "Clusters" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string (replace `<password>` with your actual password)

## Step 2: Deploy Backend on Render

### 2.1 Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `MAHIMAJYOTI/chatapp`

### 2.2 Configure Backend Service
```
Name: awsproject-backend
Environment: Node
Region: Oregon (or closest to your users)
Branch: master
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 2.3 Set Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatapp?retryWrites=true&w=majority
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
```

### 2.4 Deploy Backend
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the backend URL (e.g., `https://awsproject-backend.onrender.com`)

## Step 3: Deploy Frontend on Render

### 3.1 Create New Static Site
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Static Site"
3. Connect your GitHub repository: `MAHIMAJYOTI/chatapp`

### 3.2 Configure Frontend Service
```
Name: awsproject-frontend
Branch: master
Root Directory: jellylemonshake
Build Command: npm install --legacy-peer-deps && REACT_APP_API_URL=https://awsproject-backend.onrender.com npm run build
Publish Directory: build
```

### 3.3 Set Environment Variables
```
REACT_APP_API_URL=https://awsproject-backend.onrender.com
REACT_APP_FRONTEND_URL=https://awsproject-frontend.onrender.com
NODE_ENV=production
CI=false
GENERATE_SOURCEMAP=false
```

### 3.4 Deploy Frontend
1. Click "Create Static Site"
2. Wait for build and deployment to complete
3. Note the frontend URL (e.g., `https://awsproject-frontend.onrender.com`)

## Step 4: Update Backend CORS Settings

### 4.1 Update Backend Environment
In your backend service on Render, add/update:
```
FRONTEND_URL=https://awsproject-frontend.onrender.com
```

### 4.2 Update CORS Configuration
The backend already has CORS configured for multiple domains, but you can add your specific frontend URL.

## Step 5: Test Your Deployment

### 5.1 Test Backend Health
Visit: `https://awsproject-backend.onrender.com/health`
Expected response: `{"status":"OK","message":"Server is healthy"}`

### 5.2 Test Frontend
Visit: `https://awsproject-frontend.onrender.com`
- Should load the chat application
- Try creating a room and sending messages
- Test meeting scheduling functionality

### 5.3 Test Meeting Scheduling
1. Create a room
2. Click "Schedule Meeting"
3. Fill out the meeting form
4. Submit and verify meeting is created
5. Check "View Meetings" to see scheduled meetings

## Step 6: Optional - Use Render Blueprint (render.yaml)

### 6.1 Deploy with Blueprint
Instead of manual setup, you can use the included `render.yaml`:

1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect and use `render.yaml`

### 6.2 Blueprint Configuration
The `render.yaml` file includes:
- Backend web service configuration
- Frontend static site configuration
- Environment variables setup
- Health check configuration

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **CORS Errors**
   - Verify frontend URL is added to backend CORS origins
   - Check environment variables are set correctly

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

4. **Socket.IO Connection Issues**
   - Check if backend is running
   - Verify CORS settings include frontend URL
   - Check browser console for connection errors

### Debug Commands:
```bash
# Check backend logs
# Go to Render dashboard → Your backend service → Logs

# Test backend API
curl https://awsproject-backend.onrender.com/health

# Test specific endpoint
curl https://awsproject-backend.onrender.com/api/rooms
```

## Cost Information

### Free Tier Limits:
- **Backend**: 750 hours/month (enough for 24/7 operation)
- **Frontend**: Unlimited static site hosting
- **Database**: 512MB storage (MongoDB Atlas free tier)

### Scaling:
- Upgrade to paid plans for more resources
- Add custom domains
- Enable auto-scaling

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **CORS**: Only allow necessary origins
3. **Database**: Use strong passwords and restrict network access
4. **HTTPS**: Render provides free SSL certificates

## Monitoring

1. **Health Checks**: Monitor `/health` endpoint
2. **Logs**: Check Render dashboard logs regularly
3. **Performance**: Monitor response times and error rates
4. **Database**: Monitor MongoDB Atlas metrics

## Next Steps

1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up CI/CD for automatic deployments
4. Add backup strategies for database
5. Implement error tracking (e.g., Sentry)

Your chat application with meeting scheduling is now deployed and ready to use! 🎉
