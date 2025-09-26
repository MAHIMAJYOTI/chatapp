@echo off
echo ========================================
echo   GitHub Push with Personal Access Token
echo ========================================
echo.
echo 1. Go to: https://github.com/settings/tokens
echo 2. Generate new token with 'repo' scope
echo 3. Copy the token
echo.
echo When prompted:
echo - Username: MAHIMAJYOTI
echo - Password: [paste your token here]
echo.
echo Press any key to continue...
pause
echo.
echo Attempting to push...
git push origin master
echo.
echo If successful, your changes will be pushed to GitHub!
echo If failed, check your token permissions.
pause
