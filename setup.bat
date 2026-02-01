@echo off
echo ========================================
echo E-Commerce Application Setup
echo ========================================
echo.

echo [1/4] Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not running
    echo Please start MongoDB manually or install it
    echo Download: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Server Dependencies...
cd server
if not exist node_modules (
    echo Installing server packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install server dependencies
        pause
        exit /b 1
    )
    echo ✓ Server dependencies installed
) else (
    echo ✓ Server dependencies already installed
)

echo.
echo [3/4] Installing Client Dependencies...
cd ..\client
if not exist node_modules (
    echo Installing client packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install client dependencies
        pause
        exit /b 1
    )
    echo ✓ Client dependencies installed
) else (
    echo ✓ Client dependencies already installed
)

echo.
echo [4/4] Setup Complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Configure your .env file in the server directory
echo 2. Run 'start-dev.bat' to start both servers
echo.
echo Or manually:
echo   - Terminal 1: cd server ^&^& npm run dev
echo   - Terminal 2: cd client ^&^& npm run dev
echo.
echo ========================================
pause
