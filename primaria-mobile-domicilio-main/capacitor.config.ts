import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2e09dac30b1a4929868924ab8bd772f8',
  appName: 'primaria-mobile-domicilio',
  webDir: 'dist',
  server: {
    url: 'https://2e09dac3-0b1a-4929-8689-24ab8bd772f8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#199bb5'
    },
    SafeArea: {
      enabled: true
    }
  }
};

export default config;