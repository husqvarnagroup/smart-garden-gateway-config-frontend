import { apiFetch } from '@/services/api';

export type WifiNetwork = {
  ssid: string;
  signal?: number;
  security?: string;
  isHidden: boolean | undefined;
};

export type WifiConfig = {
  ssid: string;
  key_mgmt: string;
  isHidden: boolean | undefined;
};

export const wifiScan = (): Promise<WifiNetwork[]> => apiFetch<WifiNetwork[]>('/wifi_list', 'GET');

export const getCurrentWifi = (): Promise<WifiConfig> => apiFetch<WifiConfig>('/wifi', 'GET');

export const setWifi = (ssid: string, security: string, password: string): Promise<WifiConfig> =>
  apiFetch<WifiConfig>('/wifi', 'PUT', {
    ssid,
    key_mgmt: security || 'none',
    psk: password || '',
  });

export const resetWifi = (): Promise<void> => apiFetch<void>('/wifi', 'DELETE');
