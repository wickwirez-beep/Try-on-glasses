# The Look - Android APK Build Guide

This guide explains how to build and deploy The Look app as an Android APK.

## What is an APK?

An APK (Android Package) is the file format used to distribute and install apps on Android devices. This APK wraps the web app in a native Android container using Capacitor, allowing it to be installed like any other Android app.

## Prerequisites

- **Node.js** (v18+) - Already installed
- **npm** or **pnpm** - Already installed
- **Java Development Kit (JDK)** (v11+) - Required for Android build
- **Android SDK** - Required for Android build
- **Android Studio** (optional) - For testing and debugging

## Quick Start

### Option 1: Automated Build (Recommended)

Run the automated build script:

```bash
cd /home/ubuntu/glass-try-on-app
./build-apk.sh
```

This script will:
1. Build the web app
2. Install Capacitor dependencies
3. Initialize Capacitor
4. Add Android platform
5. Sync files
6. Build the APK

The APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Manual Build Steps

If the automated script doesn't work, follow these manual steps:

```bash
# 1. Build the web app
pnpm build

# 2. Install Capacitor
pnpm add -D @capacitor/core @capacitor/cli @capacitor/android

# 3. Initialize Capacitor
npx cap init --web-dir dist/client

# 4. Add Android platform
npx cap add android

# 5. Sync files
npx cap sync android

# 6. Build APK
cd android
./gradlew assembleDebug
cd ..
```

## Installation on Android Device

### Via ADB (Android Debug Bridge)

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Manual Installation

1. Transfer the APK file to your Android device
2. Open a file manager on the device
3. Navigate to the APK file
4. Tap to install
5. Grant permissions when prompted

## APK Details

- **App ID**: com.theglasses.tryon
- **App Name**: The Look
- **Version**: 2.1.1
- **Build Type**: Debug (unsigned)
- **Minimum Android**: API 21 (Android 5.0)
- **Target Android**: API 33 (Android 13)

## Release Build (For App Store)

For production release to Google Play Store:

```bash
cd android
./gradlew assembleRelease
cd ..
```

You'll need to:
1. Create a keystore file for signing
2. Configure signing in `android/app/build.gradle`
3. Sign the APK with your release key

## Troubleshooting

### "Java not found"
Install Java Development Kit (JDK):
```bash
sudo apt-get install openjdk-11-jdk
```

### "Android SDK not found"
Install Android SDK through Android Studio or:
```bash
sudo apt-get install android-sdk
```

### Build fails with gradle errors
Clear gradle cache:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

### APK won't install
- Ensure device has "Unknown Sources" enabled in Settings
- Uninstall any previous version first
- Check device has enough storage space

## Features in APK

The APK includes all web app features:
- ✅ Photo upload and face detection
- ✅ Virtual glasses try-on
- ✅ 21+ frame styles and colors
- ✅ Face shape detection and recommendations
- ✅ Real-time video try-on
- ✅ Dark mode toggle
- ✅ Eyewear inventory search
- ✅ Analytics tracking
- ✅ Social media sharing
- ✅ Email/SMS notifications

## File Size

- Debug APK: ~45-50 MB
- Release APK: ~35-40 MB (optimized)

## Next Steps

1. **Build the APK** using the script above
2. **Test on Android device** to verify all features work
3. **Create release build** for production deployment
4. **Sign and upload** to Google Play Store

## Support

For issues or questions, refer to:
- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Developer Guide](https://developer.android.com/)
- [The Look Project README](./README.md)

---

**Version**: 2.1.1  
**Last Updated**: 2026-06-08
