# Start Server Script
Write-Host "Starting Teacher Dashboard Server..." -ForegroundColor Green

# Set environment variables - UPDATE THIS PASSWORD with your actual MySQL password
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_USER = "app"
$env:DB_PASSWORD = "your_actual_mysql_password_here"  # ⚠️ UPDATE THIS!
$env:DB_NAME = "user_interactions_db"

Write-Host "Environment variables set:" -ForegroundColor Yellow
Write-Host "DB_HOST: $env:DB_HOST" -ForegroundColor Cyan
Write-Host "DB_USER: $env:DB_USER" -ForegroundColor Cyan
Write-Host "DB_NAME: $env:DB_NAME" -ForegroundColor Cyan
Write-Host "DB_PASSWORD: [HIDDEN]" -ForegroundColor Cyan

Write-Host ""
Write-Host "⚠️  IMPORTANT: Please update the DB_PASSWORD in this script with your actual MySQL password!" -ForegroundColor Red
Write-Host "   The current password is set to: 'your_actual_mysql_password_here'" -ForegroundColor Red
Write-Host ""

# Navigate to server directory and start
Write-Host "Starting server..." -ForegroundColor Yellow
cd server
node server.js
