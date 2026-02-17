#!/bin/bash

# Clinic Management System - Setup Script
# This script sets up both backend and frontend

set -e

echo "========================================"
echo "Clinic Management System Setup"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

command -v php >/dev/null 2>&1 || { echo -e "${RED}PHP is required but not installed.${NC}" >&2; exit 1; }
command -v composer >/dev/null 2>&1 || { echo -e "${RED}Composer is required but not installed.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed.${NC}" >&2; exit 1; }

echo -e "${GREEN}✓ All prerequisites found${NC}"
echo ""

# Backend setup
echo "========================================"
echo "Setting up Backend (Laravel)"
echo "========================================"
cd backend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping...${NC}"
fi

echo "Installing Composer dependencies..."
composer install

echo "Generating application key..."
php artisan key:generate

echo "Running database migrations..."
php artisan migrate --force

echo "Seeding database with demo data..."
php artisan db:seed --force

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend setup
echo "========================================"
echo "Setting up Frontend (React)"
echo "========================================"
cd ../frontend

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping...${NC}"
fi

echo "Installing npm dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Final instructions
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   php artisan serve"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Access the applications:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000/api"
echo "   - Admin Panel: http://localhost:8000/admin"
echo ""
echo "Demo Credentials:"
echo "   Admin:        admin@clinic.com / password"
echo "   Doctor:       doctor@clinic.com / password"
echo "   Receptionist: reception@clinic.com / password"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
