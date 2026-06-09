// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { getCurrentWifi, type WifiConfig, type WifiNetwork, wifiScan } from '@/services/wifi.ts';

const isHidden = (ssid: string) => !ssid || [...ssid].every((c) => c.charCodeAt(0) === 0);

export const getNormalisedWifiInfo = async (): Promise<WifiConfig | undefined> => {
  const wifi = await getCurrentWifi();
  if (!wifi) {
    return undefined;
  }

  if (isHidden(wifi.ssid)) {
    wifi.isHidden = true;
  } else {
    wifi.isHidden = false;
  }
  return wifi;
};

export const getNormalisedNetworks = async (): Promise<WifiNetwork[]> => {
  const networks = await wifiScan();
  return networks.map((network) => ({
    ...network,
    isHidden: isHidden(network.ssid),
  }));
};
