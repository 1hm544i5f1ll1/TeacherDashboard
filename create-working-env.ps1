# Create working .env file script
Write-Host "Creating working .env file..." -ForegroundColor Green

# Based on the successful database connection test
$envContent = @"
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app
DB_PASSWORD=app
DB_NAME=user_interactions_db
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -Force

Write-Host ".env file updated with working configuration!" -ForegroundColor Green
Write-Host "DB_PASSWORD set to 'app' (based on successful connection test)" -ForegroundColor Cyan
