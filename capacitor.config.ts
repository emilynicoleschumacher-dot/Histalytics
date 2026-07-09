import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.histalytics.app',
  appName: 'Histalytics',
  webDir: 'dist/client',
  server: {
    url: 'https://histalytics.vercel.app',
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
    },
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
