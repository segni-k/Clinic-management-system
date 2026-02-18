#!/bin/bash

# Clinic Management System - Development Run Script
# This script starts both backend and frontend servers

set -e

echo "================================================"
echo "Clinic Management System - Development Setup"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env files exist, if not create from examples
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Creating backend/.env from .env.example${NC}"
    cp backend/.env.example backend/.env
    # Generate APP_KEY if not present
    cd backend && php artisan key:generate --quiet && cd ..
fi

if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}Creating frontend/.env.local from .env.example${NC}"
    cp frontend/.env.example frontend/.env.local
fi

echo ""
echo -e "${BLUE}Setting up Backend...${NC}"
echo "================================================"

cd backend

# Install backend dependencies if not present
if [ ! -d "vendor" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    composer install
fi

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
php artisan migrate --force || true

# Seed database (optional, comment out to skip)
echo -e "${YELLOW}Seeding database...${NC}"
php artisan db:seed || true

cd ..

echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"
echo "================================================"

cd frontend

# Install frontend dependencies if not present
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

cd ..

echo ""
echo -e "${GREEN}Setup Complete!${NC}"
echo ""
echo "================================================"
echo "Starting Development Servers..."
echo "================================================"
echo ""
echo -e "${BLUE}Backend: http://localhost:8000${NC}"
echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Start backend and frontend in parallel
(
    cd backend
    echo -e "${YELLOW}Starting Laravel backend server...${NC}"
    php artisan serve
) &

BACKEND_PID=$!

(
    cd frontend
    echo -e "${YELLOW}Starting Vite frontend server...${NC}"
    npm run dev
) &

FRONTEND_PID=$!

# Handle graceful shutdown
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT INT TERM

# Wait for both processes
wait
