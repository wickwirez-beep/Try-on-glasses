#!/bin/bash

# The Look - Docker APK Builder Script
# This script builds the Android APK inside a Docker container

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        The Look - Android APK Docker Builder              ║"
echo "║              Version 2.1.1                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker found: $(docker --version)"
echo ""

# Create output directory
mkdir -p apk-output
echo "📁 Created output directory: apk-output/"
echo ""

# Option 1: Using Docker Compose (Recommended)
if command -v docker-compose &> /dev/null || command -v docker compose &> /dev/null; then
    echo "🐳 Building APK using Docker Compose..."
    echo ""
    
    # Try docker compose first (newer syntax)
    if docker compose version &> /dev/null; then
        docker compose -f docker-compose.apk.yml up --build
    else
        # Fall back to docker-compose
        docker-compose -f docker-compose.apk.yml up --build
    fi
else
    echo "🐳 Building APK using Docker..."
    echo ""
    
    # Build Docker image
    docker build -f Dockerfile.android -t the-look-apk-builder:latest .
    
    # Run container
    docker run --rm \
        -v "$(pwd)/apk-output:/output" \
        -v "$(pwd):/app" \
        -e ANDROID_HOME=/opt/android-sdk \
        -e JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 \
        the-look-apk-builder:latest
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  Build Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if APK was created
if [ -f "apk-output/the-look.apk" ]; then
    APK_SIZE=$(du -h apk-output/the-look.apk | cut -f1)
    echo "✅ APK successfully created!"
    echo "📍 Location: apk-output/the-look.apk"
    echo "📦 Size: $APK_SIZE"
    echo ""
    echo "📲 Installation options:"
    echo ""
    echo "   1. Via ADB (Android Debug Bridge):"
    echo "      adb install apk-output/the-look.apk"
    echo ""
    echo "   2. Manual installation:"
    echo "      - Transfer the APK to your Android device"
    echo "      - Open file manager and tap the APK"
    echo "      - Grant permissions and install"
    echo ""
    echo "   3. Via email or cloud storage:"
    echo "      - Upload to Google Drive, Dropbox, etc."
    echo "      - Download on Android device and install"
    echo ""
else
    echo "❌ APK build failed!"
    echo "📋 Check the build output above for errors."
    exit 1
fi

echo ""
echo "🎉 Ready to install on Android devices!"
echo ""
