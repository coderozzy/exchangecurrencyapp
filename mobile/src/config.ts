
const USE_NGROK = true; // Set to TRUE to use Ngrok, FALSE for Localhost

const DEV_MACHINE_IP = '192.168.1.221';
const NGROK_URL = 'https://gramophonical-sophisticatedly-brigitte.ngrok-free.dev/api';
const LOCAL_URL = `http://${DEV_MACHINE_IP}:8080/api`;

export const API_CONFIG = {
  BASE_URL: USE_NGROK ? NGROK_URL : LOCAL_URL,
  TIMEOUT: 10000,
};
