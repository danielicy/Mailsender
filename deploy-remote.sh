#!/bin/bash
# Deploy script to run on remote server

cd ~/mailsender

echo "Stopping existing containers..."
sudo docker-compose down 2>/dev/null || true

echo "Building Docker image..."
sudo docker-compose build

echo "Starting container..."
sudo docker-compose up -d

echo "Checking container status..."
sudo docker-compose ps

echo "Viewing logs..."
sudo docker-compose logs --tail=20

echo ""
echo "Deployment complete!"
echo "Application should be running on port 3000"
