@echo off
echo ========================================
echo    Adding Products to Your Store
echo ========================================
echo.

cd server
node seedProducts.js

echo.
echo ========================================
echo Press any key to close...
pause > nul
