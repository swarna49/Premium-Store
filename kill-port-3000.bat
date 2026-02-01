@echo off
echo ========================================
echo Killing Process on Port 3000
echo ========================================
echo.

echo Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Found process: %%a
    echo Killing process...
    taskkill /PID %%a /F
    echo ✓ Process killed successfully
    goto :done
)

echo No process found on port 3000

:done
echo.
echo ========================================
echo Port 3000 is now free
echo ========================================
timeout /t 2 /nobreak >nul
