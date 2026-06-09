# The Look - Docker APK Build Guide

Build Android APK for The Look app using Docker. No need to install Android SDK, Java, or Gradle locally!

## Overview

This Docker setup automates the entire APK build process:
- Downloads and configures Android SDK
- Installs Java Development Kit
- Builds the web app
- Wraps it with Capacitor
- Generates a production-ready APK

## Prerequisites

- **Docker** (v20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (optional, v2.0+) - Included with Docker Desktop
- **~20 GB disk space** for Android SDK and build artifacts
- **~30-60 minutes** build time (first build takes longer)

## Quick Start

### 1. Build the APK

```bash
cd /home/ubuntu/glass-try-on-app
./docker-build-apk.sh
```

The script will:
- Check Docker installation
- Build the Docker image
- Compile the web app
- Generate the APK
- Output to `apk-output/the-look.apk`

### 2. Install on Android Device

**Option A: Via ADB**
```bash
adb install apk-output/the-look.apk
```

**Option B: Manual Installation**
1. Transfer `apk-output/the-look.apk` to your Android device
2. Open file manager and tap the APK
3. Grant permissions and install

**Option C: Via Cloud Storage**
1. Upload APK to Google Drive, Dropbox, or similar
2. Download on Android device
3. Install from downloads folder

## File Structure

```
glass-try-on-app/
├── Dockerfile.android          # Multi-stage Docker build
├── docker-compose.apk.yml      # Docker Compose configuration
├── docker-build-apk.sh         # Build script (run this!)
├── APK_BUILD_GUIDE.md          # Manual build guide
├── DOCKER_APK_BUILD.md         # This file
└── apk-output/                 # Output directory (created after build)
    └── the-look.apk            # Final APK file
```

## Docker Build Details

### Dockerfile Stages

**Stage 1: android-builder**
- Base: Ubuntu 22.04
- Installs: Java 11, Node.js, Android SDK
- Builds: Web app, Capacitor setup, APK

**Stage 2: output**
- Extracts APK and documentation
- Creates build info file

**Stage 3: scratch**
- Minimal final image
- Contains only the APK

### Build Time Estimates

| Build Type | Time | Notes |
|-----------|------|-------|
| First build | 45-60 min | Downloads SDK, builds everything |
| Cached build | 15-20 min | Reuses Docker layers |
| Incremental | 5-10 min | Only rebuilds changed files |

## Advanced Usage

### Using Docker Compose

```bash
docker compose -f docker-compose.apk.yml up --build
```

### Manual Docker Build

```bash
# Build image
docker build -f Dockerfile.android -t the-look-apk-builder:latest .

# Run container
docker run --rm \
  -v "$(pwd)/apk-output:/output" \
  -v "$(pwd):/app" \
  the-look-apk-builder:latest
```

### Custom Build Options

Edit `docker-compose.apk.yml` to customize:
- Android SDK version
- Build tools version
- NDK version
- Output directory

### Parallel Builds

Build multiple APKs simultaneously:

```bash
# Terminal 1
./docker-build-apk.sh

# Terminal 2 (in different directory)
./docker-build-apk.sh
```

Each build runs in its own container.

## Troubleshooting

### "Docker daemon is not running"
Start Docker:
```bash
# macOS/Windows
open -a Docker

# Linux
sudo systemctl start docker
```

### "Permission denied" error
Add user to docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Build fails with "Out of memory"
Increase Docker memory limit:
- Docker Desktop: Preferences → Resources → Memory (set to 8GB+)
- Docker CLI: `docker run --memory=8g ...`

### "No space left on device"
Free up disk space or increase Docker volume size:
```bash
docker system prune -a  # Remove unused images
```

### Build takes too long
- First build is slow (downloads 2GB+ SDK)
- Subsequent builds use cached layers (much faster)
- Use `docker system prune` to clean up old builds

### APK not created
Check Docker logs:
```bash
docker logs the-look-apk-builder
```

## APK Details

- **App ID**: com.theglasses.tryon
- **App Name**: The Look
- **Version**: 2.1.1
- **Build Type**: Debug (unsigned)
- **Minimum Android**: API 21 (Android 5.0)
- **Target Android**: API 33 (Android 13)
- **Size**: ~45-50 MB (debug), ~35-40 MB (release)

## Features Included

✅ Photo upload and face detection  
✅ Virtual glasses try-on  
✅ 21+ frame styles and colors  
✅ Face shape detection  
✅ Real-time video try-on  
✅ Dark mode toggle  
✅ Eyewear inventory search  
✅ Analytics tracking  
✅ Social media sharing  
✅ Email/SMS notifications  

## Release Build

For production release to Google Play Store:

1. **Create signing key**:
```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias the-look-key
```

2. **Update build.gradle**:
```gradle
signingConfigs {
    release {
        storeFile file("release.keystore")
        storePassword "your-password"
        keyAlias "the-look-key"
        keyPassword "your-password"
    }
}
```

3. **Build release APK**:
```bash
cd android
./gradlew assembleRelease
cd ..
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build APK
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/setup-buildx-action@v1
      - run: ./docker-build-apk.sh
      - uses: actions/upload-artifact@v2
        with:
          name: the-look.apk
          path: apk-output/the-look.apk
```

## Performance Tips

1. **Use BuildKit** for faster builds:
```bash
export DOCKER_BUILDKIT=1
./docker-build-apk.sh
```

2. **Cache Docker layers**:
```bash
docker build --cache-from the-look-apk-builder:latest .
```

3. **Use volume mounts** for faster rebuilds:
```bash
docker run -v "$(pwd):/app" ...
```

## Security Notes

- Debug APK is unsigned (not for production)
- Sign APK before uploading to Play Store
- Keep signing key secure and backed up
- Don't commit signing keys to version control

## Support

For issues or questions:
- [Docker Documentation](https://docs.docker.com/)
- [Capacitor Documentation](https://capacitorjs.com/)
- [Android Developer Guide](https://developer.android.com/)
- [The Look Project README](./README.md)

## Next Steps

1. ✅ Build APK with `./docker-build-apk.sh`
2. ✅ Test on Android device
3. ✅ Create release build with signing
4. ✅ Upload to Google Play Store
5. ✅ Monitor analytics and user feedback

---

**Version**: 2.1.1  
**Last Updated**: 2026-06-08  
**Docker Version Required**: 20.10+  
**Estimated Build Time**: 30-60 minutes (first build)
