// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';

import * as wifiService from '@/services/wifi';
import type { WifiConfig, WifiNetwork } from '@/services/wifi';
import { getNormalisedNetworks, getNormalisedWifiInfo } from '@/utils/wifiUtils.ts';

vi.mock('@/services/wifi', () => ({
  getCurrentWifi: vi.fn<() => Promise<WifiConfig>>(),
  wifiScan: vi.fn<() => Promise<WifiNetwork[]>>(),
}));

describe('wifi utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNormalisedWifiInfo', () => {
    it('returns undefined when the gateway is connected via LAN and /wifi returns null', async () => {
      vi.mocked(wifiService.getCurrentWifi).mockResolvedValue(null as unknown as WifiConfig);

      await expect(getNormalisedWifiInfo()).resolves.toBeUndefined();
    });

    it('sets isHidden to false and keeps the ssid for a regular network', async () => {
      vi.mocked(wifiService.getCurrentWifi).mockResolvedValue({
        ssid: 'MyNetwork',
        key_mgmt: 'WPA-PSK',
        isHidden: undefined,
      });

      const result = await getNormalisedWifiInfo();

      expect(result?.ssid).toBe('MyNetwork');
      expect(result?.isHidden).toBe(false);
    });

    it('sets isHidden to true for hidden current wifi and keeps the backend ssid as-is', async () => {
      vi.mocked(wifiService.getCurrentWifi).mockResolvedValue({
        ssid: '',
        key_mgmt: 'WPA-PSK',
        isHidden: undefined,
      });

      const result = await getNormalisedWifiInfo();

      expect(result?.ssid).toBe('');
      expect(result?.isHidden).toBe(true);
    });
  });

  describe('getNormalisedNetworks', () => {
    it('normalises a mixed list, flagging hidden networks while preserving raw ssids', async () => {
      vi.mocked(wifiService.wifiScan).mockResolvedValue([
        { ssid: 'VisibleNetwork', signal: 80, security: 'WPA-PSK', isHidden: undefined },
        { ssid: '', signal: 50, security: 'WPA-PSK', isHidden: undefined },
      ]);

      const results = await getNormalisedNetworks();

      expect(results[0]!.ssid).toBe('VisibleNetwork');
      expect(results[0]!.isHidden).toBe(false);

      expect(results[1]!.ssid).toBe('');
      expect(results[1]!.isHidden).toBe(true);
    });
  });
});
