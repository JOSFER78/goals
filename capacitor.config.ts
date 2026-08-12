import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.goalskids.app',
  appName: 'GOALS Platform',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'goalskid.web.app'
  }
};

export default config;
