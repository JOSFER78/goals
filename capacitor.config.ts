import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.goalskids.app',
  appName: 'GOALS Platform',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'astrolingo-96820.web.app'
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    }
  }
};

export default config;
