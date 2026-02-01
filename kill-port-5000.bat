@echo off
echo ========================================
echo Killing Process on Port 5000
echo ========================================
echo.

echo Checking for processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Found process: %%a
    echo Killing process...
    taskkill /PID %%a /F
    echo ✓ Process killed successfully
    goto :done
)

echo No process found on port 5000

:done
echo.
echo ========================================
echo Port 5000 is now free
echo ========================================
timeout /t 2 /nobreak >nul
