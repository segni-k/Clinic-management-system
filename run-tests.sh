#!/bin/bash

# Clinic Management System - Test Runner Script
# This script runs all tests and generates coverage reports

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

cd backend

echo "================================================"
echo "Clinic Management System - Running Tests"
echo "================================================"
echo ""

# Check if .env.testing exists
if [ ! -f ".env.testing" ]; then
    echo -e "${YELLOW}Creating .env.testing from .env.example${NC}"
    cp .env.example .env.testing
    # Update testing specific values
    sed -i 's/DB_DATABASE=clinic_management/DB_DATABASE=clinic_management_test/' .env.testing
    sed -i 's/APP_ENV=local/APP_ENV=testing/' .env.testing
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env.testing
fi

echo ""
echo -e "${BLUE}Available Test Suites:${NC}"
echo "1. All Tests"
echo "2. Feature Tests Only"
echo "3. Unit Tests Only"
echo "4. Patient Creation Tests"
echo "5. Appointment Booking Tests"
echo "6. Invoice Payment Tests"
echo "7. Role Access Control Tests"
echo "8. All Tests with Coverage"
echo ""

if [ $# -eq 0 ]; then
    read -p "Select test suite (1-8, default: 1): " choice
    choice=${choice:-1}
else
    choice=$1
fi

echo ""

case $choice in
    1)
        echo -e "${BLUE}Running All Tests...${NC}"
        ./vendor/bin/phpunit
        ;;
    2)
        echo -e "${BLUE}Running Feature Tests...${NC}"
        ./vendor/bin/phpunit tests/Feature
        ;;
    3)
        echo -e "${BLUE}Running Unit Tests...${NC}"
        ./vendor/bin/phpunit tests/Unit
        ;;
    4)
        echo -e "${BLUE}Running Patient Creation Tests...${NC}"
        ./vendor/bin/phpunit tests/Feature/PatientCreationTest.php
        ;;
    5)
        echo -e "${BLUE}Running Appointment Booking Tests...${NC}"
        ./vendor/bin/phpunit tests/Feature/AppointmentBookingTest.php
        ;;
    6)
        echo -e "${BLUE}Running Invoice Payment Tests...${NC}"
        ./vendor/bin/phpunit tests/Feature/InvoicePaymentTest.php
        ;;
    7)
        echo -e "${BLUE}Running Role Access Control Tests...${NC}"
        ./vendor/bin/phpunit tests/Feature/RoleAccessControlTest.php
        ;;
    8)
        echo -e "${BLUE}Running All Tests with Coverage Report...${NC}"
        ./vendor/bin/phpunit --coverage-html=coverage --coverage-text
        echo ""
        echo -e "${GREEN}Coverage report generated in coverage/ directory${NC}"
        ;;
    *)
        echo -e "${RED}Invalid selection${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Tests completed!${NC}"
echo ""

cd ..
