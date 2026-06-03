import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useWifiInfo } from '@/composables/useWifiInfo';
import i18next from '@/i18n';
import * as wifiService from '@/services/wifi';
import type { WifiConfig, WifiNetwork } from '@/services/wifi';

vi.mock('@/services/wifi', () => ({
  getCurrentWifi: vi.fn<() => Promise<WifiConfig>>(),
  wifiScan: vi.fn<() => Promise<WifiNetwork[]>>(),
}));

describe('useWifiInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNormalisedWifiInfo', () => {
    it('sets isHidden to false and keeps the ssid for a regular network', async () => {
      vi.mocked(wifiService.getCurrentWifi).mockResolvedValue({
        ssid: 'MyNetwork',
        key_mgmt: 'WPA2',
        isHidden: undefined,
      });

      const { getNormalisedWifiInfo } = useWifiInfo();
      const result = await getNormalisedWifiInfo();

      expect(result.ssid).toBe('MyNetwork');
      expect(result.isHidden).toBe(false);
    });

    it('sets isHidden to true and replaces ssid with the hidden label when ssid is empty', async () => {
      vi.mocked(wifiService.getCurrentWifi).mockResolvedValue({
        ssid: '',
        key_mgmt: 'WPA2',
        isHidden: undefined,
      });

      const { getNormalisedWifiInfo } = useWifiInfo();
      const result = await getNormalisedWifiInfo();

      expect(result.ssid).toBe(i18next.t('network.hidden.label'));
      expect(result.isHidden).toBe(true);
    });
  });

  describe('getNormalisedNetworks', () => {
    it('normalises a mixed list, flagging hidden networks and leaving visible ones intact', async () => {
      vi.mocked(wifiService.wifiScan).mockResolvedValue([
        { ssid: 'VisibleNetwork', signal: 80, security: 'WPA2', isHidden: undefined },
        { ssid: '', signal: 50, security: 'WPA2', isHidden: undefined },
      ]);

      const { getNormalisedNetworks } = useWifiInfo();
      const results = await getNormalisedNetworks();

      expect(results[0]!.ssid).toBe('VisibleNetwork');
      expect(results[0]!.isHidden).toBe(false);

      expect(results[1]!.ssid).toBe(i18next.t('network.hidden.label'));
      expect(results[1]!.isHidden).toBe(true);
    });
  });
});
