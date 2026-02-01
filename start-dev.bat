@echo off
echo ========================================
echo Starting E-Commerce Application
echo ========================================
echo.

echo [1/3] Cleaning up ports...
echo Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process on port 5000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

echo Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process on port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)
echo ✓ Ports cleaned

echo.
echo [2/3] Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo ✓ Check the new terminal windows for server status
echo.
echo Press any key to close this window
echo (Servers will continue running in separate windows)
echo ========================================
pause >nul
