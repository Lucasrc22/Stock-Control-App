import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stockcontrol',
  appName: 'StockControl',
  webDir: 'dist',
  server: {
    androidScheme: "http"
  }
};


export default config;