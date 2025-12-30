#!/bin/bash
echo "=========================================="
echo "Starting Exchange Currency App - MOBILE"
echo "=========================================="

# Check if Node is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    exit 1
fi

cd mobile || exit
echo "Installing dependencies (if needed)..."
npm install

echo ""
echo "------------------------------------------"
echo "Press 'w' for Web"
echo "Press 'i' for iOS Simulator"
echo "Press 'a' for Android Emulator"
echo "------------------------------------------"
echo ""

npm start
