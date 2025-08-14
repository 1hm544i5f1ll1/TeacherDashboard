# Create .env file script
Write-Host "Creating .env file..." -ForegroundColor Green

$envContent = @"
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=app
DB_PASSWORD=your_password_here
DB_NAME=user_interactions_db
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host ".env file created successfully!" -ForegroundColor Green
Write-Host "Please update the DB_PASSWORD with your actual MySQL password" -ForegroundColor Yellow
