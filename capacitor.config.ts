import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theglasses.tryon',
  appName: 'The Look',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    Camera: {
      // Allow both photo library and camera
      permissions: ['camera', 'photos'],
    },
    Filesystem: {
      // Enable file system access
    },
  },
};

export default config;
