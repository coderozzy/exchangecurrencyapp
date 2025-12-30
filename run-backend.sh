#!/bin/bash
echo "=========================================="
echo "Starting Exchange Currency App - BACKEND"
echo "=========================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed."
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Error: Maven is not installed."
    exit 1
fi

cd backend || exit
mvn spring-boot:run
