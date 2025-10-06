# update-and-start.ps1
Write-Host "Pulling latest changes..."
git pull

Write-Host "Installing dependencies..."
npm install

Write-Host "Starting development server..."
npm run dev
