# Deploy Mail Sender Application to Remote Server
# Server: 10.0.0.5

$SERVER = "10.0.0.5"
$REMOTE_USER = "administrator"  # Change this to your username
$REMOTE_PATH = "/home/$REMOTE_USER/mailsender"
$APP_NAME = "mailsender"

Write-Host "Deploying Mail Sender Application to $SERVER..." -ForegroundColor Green

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
$exclude = @("node_modules", ".git", ".env")
$files = Get-ChildItem -Exclude $exclude

# Copy files to remote server
Write-Host "Copying files to remote server..." -ForegroundColor Yellow
scp -r * ${REMOTE_USER}@${SERVER}:${REMOTE_PATH}/

# Execute deployment on remote server
Write-Host "Building and starting Docker container on remote server..." -ForegroundColor Yellow
ssh ${REMOTE_USER}@${SERVER} @"
cd ${REMOTE_PATH}
docker-compose down
docker-compose build
docker-compose up -d
docker ps
"@

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Application should be running at http://${SERVER}:3000" -ForegroundColor Cyan
