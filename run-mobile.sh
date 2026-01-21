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

# Check config.ts for USE_NGROK setting
CONFIG_FILE="src/config.ts"
if grep -q "const USE_NGROK = true" "$CONFIG_FILE"; then
    echo "Detected USE_NGROK = true in config.ts"
    echo "Starting in TUNNEL mode..."
    MODE="--tunnel"
else
    echo "Detected USE_NGROK = false (or not set) in config.ts"
    echo "Starting in LAN mode..."
    MODE="--lan"
fi

echo "Installing dependencies (if needed)..."
npm install

echo ""
echo "------------------------------------------"
echo "Press 'w' for Web"
echo "Press 'i' for iOS Simulator"
echo "Press 'a' for Android Emulator"
echo "------------------------------------------"
echo ""

npm start -- $MODE
