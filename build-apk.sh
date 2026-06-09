#!/bin/bash

set -e

echo "🔨 Building The Look APK..."
echo ""

# Step 1: Build the web app
echo "📦 Step 1: Building web app..."
pnpm build

# Step 2: Install Capacitor
echo "📱 Step 2: Installing Capacitor..."
pnpm add -D @capacitor/core @capacitor/cli @capacitor/android

# Step 3: Initialize Capacitor
echo "⚙️  Step 3: Initializing Capacitor..."
npx cap init --web-dir dist/client

# Step 4: Add Android platform
echo "🤖 Step 4: Adding Android platform..."
npx cap add android

# Step 5: Sync files to Android project
echo "🔄 Step 5: Syncing files to Android..."
npx cap sync android

# Step 6: Build APK
echo "🏗️  Step 6: Building APK..."
cd android
./gradlew assembleDebug
cd ..

# Step 7: Locate APK
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "✅ APK build successful!"
    echo "📍 APK location: $APK_PATH"
    echo ""
    echo "📲 To install on Android device:"
    echo "   adb install $APK_PATH"
    echo ""
    echo "Or transfer the APK file to your device and install manually."
else
    echo "❌ APK build failed. Check the build output above."
    exit 1
fi
