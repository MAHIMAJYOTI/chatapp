# 🔑 GitHub Personal Access Token Guide

## Step 1: Generate Token
1. Go to: https://github.com/settings/tokens
2. Click: "Generate new token (classic)"
3. Give it a name: "Video Call App Push"
4. Select scopes: ✅ `repo` ✅ `workflow`
5. Click: "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

## Step 2: Use Token
When Git prompts for credentials:
- **Username:** MAHIMAJYOTI
- **Password:** [paste your token here]

## Step 3: Push Changes
Run: `git push origin master`

Your video call features will be pushed to GitHub and Render will auto-deploy!
