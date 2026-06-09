# APK Installation Guide - The Look

This guide explains how to build and install The Look app on your Android device.

## Automatic APK Builds (GitHub Actions)

The easiest way to get the APK is through GitHub Actions:

### Step 1: Push Code to GitHub
1. Export your project to GitHub (use the Management UI → More → GitHub)
2. Push your code to the `main` or `develop` branch
3. GitHub Actions will automatically start building the APK

### Step 2: Download the APK
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Find the latest **Build APK** workflow run
4. Click on it to open the details
5. Scroll down to **Artifacts** section
6. Download **app-debug.apk**

### Step 3: Install on Your Device

#### Option A: Direct Installation (Easiest)
1. Transfer the APK file to your Android device
2. Open a file manager on your device
3. Navigate to the APK file
4. Tap it to install
5. Grant permissions when prompted
6. Launch The Look from your app drawer

#### Option B: Using ADB (Advanced)
If you have Android SDK tools installed on your computer:

```bash
# Connect your device via USB
adb devices

# Install the APK
adb install app-debug.apk

# Launch the app
adb shell am start -n com.glasstryon.app/.MainActivity
```

## Manual Local Build (Advanced)

If you want to build the APK locally on your machine:

### Prerequisites
- Node.js 22+
- Java 17+
- Android SDK (API level 34)
- Gradle

### Build Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Build the web app
pnpm run build

# 3. Sync to Android
npx cap sync android

# 4. Build APK
cd android
./gradlew assembleDebug

# 5. APK will be at: app/build/outputs/apk/debug/app-debug.apk
```

## Troubleshooting

### "Installation failed" Error
- **Cause**: App already installed with different signature
- **Solution**: Uninstall the old version first, then install the new APK

### "Unknown sources" Error
- **Cause**: Device doesn't allow installation from unknown sources
- **Solution**: 
  1. Go to Settings → Security
  2. Enable "Unknown sources" or "Install unknown apps"
  3. Try installing again

### App Crashes on Launch
- **Cause**: Camera permissions not granted
- **Solution**: 
  1. Go to Settings → Apps → The Look
  2. Permissions → Camera → Allow
  3. Permissions → Photos → Allow
  4. Relaunch the app

### Camera Not Working
- **Cause**: Camera permission denied
- **Solution**: Grant camera permission when the app asks, or manually enable it in Settings

### Face Detection Not Working
- **Cause**: Poor lighting or unclear face in photo
- **Solution**: 
  1. Use a well-lit environment
  2. Take a clear, front-facing selfie
  3. Ensure your face is clearly visible
  4. Try uploading a different photo

## Features Available on APK

✅ Photo upload with face detection
✅ Real-time camera try-on
✅ 21 glasses frames to choose from
✅ Style and color filtering
✅ Brightness and mirror controls
✅ Frame capture (download try-on results)
✅ Quality score display
✅ Favorites system
✅ Full offline support (after first load)

## Performance Tips

- Use a well-lit environment for best face detection
- Close other apps to free up memory
- Restart the app if it feels sluggish
- Clear app cache if storage is low (Settings → Apps → The Look → Storage → Clear Cache)

## Reporting Issues

If you encounter any issues:
1. Note the exact error message
2. Check the troubleshooting section above
3. Try the suggested solutions
4. If issues persist, report them on GitHub Issues

## Version Information

- **App Version**: 1.2.0
- **Build Number**: 12
- **Minimum Android**: API 24 (Android 7.0)
- **Target Android**: API 34 (Android 14)

## Support

For more information, visit:
- GitHub Repository: [Your GitHub URL]
- Web Version: https://glasstryon-tprcxgs9.manus.space
- Report Issues: [GitHub Issues URL]
