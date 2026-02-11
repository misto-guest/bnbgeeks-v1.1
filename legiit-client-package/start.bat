@echo off
REM Legiit Automation - One-Click Launcher for Windows

echo.
echo 🖥️  Legiit Automation Dashboard
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Get script directory
cd /d "%~dp0"

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies (first time only, this takes about 30 seconds)...
    call npm install --silent
    echo ✅ Installation complete!
    echo.
)

echo 📡 Starting dashboard...
echo.
echo 🌐 Opening your browser...

REM Start the setup server
start /B npm run setup

REM Wait for server to be ready
timeout /t 3 /nobreak >nul

REM Open in default browser
start http://localhost:8080

echo.
echo ✅ Dashboard is running!
echo.
echo    Browser should open automatically
echo    If not, open: http://localhost:8080
echo.
echo    Close this window to stop the dashboard
echo.

REM Keep window open
pause
