import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.stockcontrol',
  appName: 'StockControl',
  webDir: 'dist',
  server: {
    androidScheme: "http"  // permite requisições HTTP
  }
};

export default config;
