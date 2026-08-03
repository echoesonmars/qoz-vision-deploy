#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Docker
print_header "Checking Docker Installation"
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"
echo ""

# Build images
print_header "Building Docker Images"
print_step "Building web and backend images..."
docker compose -f docker-compose.build.yml build
print_success "Images built successfully"
echo ""

# Start services
print_header "Starting Services"
print_step "Starting all services..."
docker compose -f docker-compose.offline.yml up -d
print_success "Services started"
echo ""

# Wait for Postgres
print_header "Waiting for PostgreSQL"
print_step "Waiting for PostgreSQL to be healthy..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker compose -f docker-compose.offline.yml ps postgres | grep -q "healthy"; then
        print_success "PostgreSQL is healthy"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_warning "PostgreSQL health check timeout, proceeding anyway..."
fi
echo ""

# Run migrations
print_header "Running Database Migrations"
print_step "Applying database migrations..."
docker compose -f docker-compose.offline.yml --profile migrate run --rm migrate
print_success "Migrations completed"
echo ""

# Restart backend to sync cameras
print_header "Restarting Backend"
print_step "Restarting backend and nginx to sync cameras..."
docker compose -f docker-compose.offline.yml up -d --force-recreate backend nginx
print_success "Backend restarted"
echo ""

# Import cameras backup if available
if [ -f "cameras-backup.json" ]; then
    print_header "Importing Cameras"
    print_step "Importing cameras from cameras-backup.json..."
    bash scripts/import-cameras.sh "http://127.0.0.1" "cameras-backup.json" || true
    print_success "Camera import finished"
    echo ""
fi

# Show status
print_header "Service Status"
docker compose -f docker-compose.offline.yml ps
echo ""

# Show URLs
print_header "Access URLs"
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="<SERVER_IP>"
fi

echo -e "${GREEN}Web UI:${NC}         http://$SERVER_IP/"
echo -e "${GREEN}Backend Health:${NC} http://$SERVER_IP/backend/health"
echo -e "${GREEN}All Cameras:${NC}    http://$SERVER_IP/dashboard/cameras/all"
echo -e "${GREEN}Manage Cameras:${NC} http://$SERVER_IP/dashboard/cameras/manage"
echo -e "${GREEN}Live View:${NC}      http://$SERVER_IP/dashboard/cameras/live"
echo ""

print_success "QOZ Offline is ready!"
print_warning "Don't forget to register your first user at http://$SERVER_IP/"
