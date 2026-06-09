#!/bin/bash

set -e

echo "🔨 Building The Look APK..."
echo ""

# Step 1: Build the web app
echo "📦 Step 1: Building web app..."
pnpm build

# Step 2: Copy web assets to Capacitor directory
echo "🔄 Step 2: Copying web assets..."
mkdir -p dist/client
cp -r dist/public/* dist/client/

# Step 3: Sync Capacitor to Android
echo "📱 Step 3: Syncing Capacitor to Android..."
npx cap sync android

# Step 4: Build APK
echo "🏗️  Step 4: Building APK..."
cd android
./gradlew assembleDebug
cd ..

# Step 5: Locate APK
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
