$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

function Assert-DockerCommand {
  param([string]$Step)

  if ($LASTEXITCODE -ne 0) {
    throw "$Step failed with exit code $LASTEXITCODE"
  }
}

New-Item -ItemType Directory -Force -Path "dist" | Out-Null

Write-Host "Building application images..."
docker compose -f docker-compose.build.yml build
Assert-DockerCommand "Application image build"

Write-Host "Pulling runtime images..."
docker pull postgres:16-alpine
Assert-DockerCommand "Postgres image pull"
docker pull minio/minio:latest
Assert-DockerCommand "MinIO image pull"
docker pull minio/mc:latest
Assert-DockerCommand "MinIO client image pull"
docker pull nginx:1.27-alpine
Assert-DockerCommand "nginx image pull"
docker pull bluenviron/mediamtx:latest-ffmpeg
Assert-DockerCommand "MediaMTX image pull"

Write-Host "Saving images to dist/qoz-offline-images.tar ..."
docker save -o dist/qoz-offline-images.tar `
  qoz-offline-web:latest `
  qoz-offline-backend:latest `
  postgres:16-alpine `
  minio/minio:latest `
  minio/mc:latest `
  nginx:1.27-alpine `
  bluenviron/mediamtx:latest-ffmpeg
Assert-DockerCommand "Image archive creation"

Write-Host "Done. Copy dist/qoz-offline-images.tar + compose/configs to the offline server."
Get-Item dist/qoz-offline-images.tar | Format-List Name, Length, FullName
