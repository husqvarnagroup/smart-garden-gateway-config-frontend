// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from '@/services/api';

import { loginRequest, logoutRequest } from '@/services/auth';
import { getCurrentTimezone, listTimezones, setTimezone } from '@/services/timezone';
import { getCurrentWifi, resetWifi, setWifi, wifiScan } from '@/services/wifi';
import { setSshEnabled, addSshKey } from '@/services/ssh';
import { setWebsocketEnabled } from '@/services/websocket';
import { getGatewayVersion, getHomekitStatus, resetHomekit } from '@/services/system';

vi.mock('@/services/api', () => ({
  apiFetch: vi.fn<typeof apiFetch>(),
}));

const mockApiFetch = vi.mocked(apiFetch);

describe('services — transforms and contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('auth', () => {
    it('loginRequest posts /login with skipAuth and returns unwrapped session', async () => {
      mockApiFetch.mockResolvedValue({ session: 'tok' });
      const result = await loginRequest('secret');
      expect(mockApiFetch).toHaveBeenCalledWith('/login', 'POST', { password: 'secret' }, true);
      expect(result).toBe('tok');
    });
  });

  describe('timezone', () => {
    it('getCurrentTimezone wraps raw string response into TimezoneConfig', async () => {
      mockApiFetch.mockResolvedValue('Europe/Zurich');
      const result = await getCurrentTimezone();
      expect(result).toEqual({ timezone: 'Europe/Zurich' });
    });

    it('setTimezone sends PUT /timezone with raw string and wraps result', async () => {
      mockApiFetch.mockResolvedValue('Europe/Berlin');
      const result = await setTimezone('Europe/Berlin');
      expect(mockApiFetch).toHaveBeenCalledWith('/timezone', 'PUT', 'Europe/Berlin');
      expect(result).toEqual({ timezone: 'Europe/Berlin' });
    });
  });

  describe('wifi', () => {
    it('setWifi sends PUT /wifi with key_mgmt + psk for a secured network', async () => {
      mockApiFetch.mockResolvedValue({ ssid: 'MyNet', key_mgmt: 'WPA2' });
      await setWifi('MyNet', 'WPA2', 'password123');
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'PUT', {
        ssid: 'MyNet',
        key_mgmt: 'WPA2',
        psk: 'password123',
      });
    });

    it('setWifi maps empty security string to key_mgmt "none"', async () => {
      mockApiFetch.mockResolvedValue({ ssid: 'OpenNet', key_mgmt: 'none' });
      await setWifi('OpenNet', '', '');
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'PUT', {
        ssid: 'OpenNet',
        key_mgmt: 'none',
        psk: '',
      });
    });

    it('setWifi forwards explicit security "none" verbatim', async () => {
      mockApiFetch.mockResolvedValue({ ssid: 'OpenNet', key_mgmt: 'none' });
      await setWifi('OpenNet', 'none', '');
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'PUT', {
        ssid: 'OpenNet',
        key_mgmt: 'none',
        psk: '',
      });
    });

    it('getCurrentWifi returns the WifiConfig returned by apiFetch', async () => {
      const config = { ssid: 'HomeNetwork', key_mgmt: 'WPA2' };
      mockApiFetch.mockResolvedValue(config);
      const result = await getCurrentWifi();
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'GET');
      expect(result).toEqual(config);
    });

    it('getCurrentWifi returns null when apiFetch returns null', async () => {
      mockApiFetch.mockResolvedValue(null);

      const result = await getCurrentWifi();

      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'GET');
      expect(result).toBeNull();
    });

    it('wifiScan returns the array of WifiNetworks returned by apiFetch', async () => {
      const networks = [
        { ssid: 'HomeNetwork', signal: 80, security: 'WPA2' },
        { ssid: 'OpenNet', signal: 60 },
      ];
      mockApiFetch.mockResolvedValue(networks);
      const result = await wifiScan();
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi_list', 'GET');
      expect(result).toEqual(networks);
    });

    // Backend currently expects `psk` to be present on every PUT — even for
    // secured networks where the password was omitted. Lock that contract.
    it('setWifi always sends psk, defaulting to empty string', async () => {
      mockApiFetch.mockResolvedValue({ ssid: 'MyNet', key_mgmt: 'WPA2' });
      await setWifi('MyNet', 'WPA2', '');
      expect(mockApiFetch).toHaveBeenCalledWith('/wifi', 'PUT', {
        ssid: 'MyNet',
        key_mgmt: 'WPA2',
        psk: '',
      });
    });
  });

  describe('system', () => {
    it('getGatewayVersion sends GET /version with skipAuth=true', async () => {
      mockApiFetch.mockResolvedValue({ gateway_version: '1.2.3' });
      await getGatewayVersion();
      expect(mockApiFetch).toHaveBeenCalledWith('/version', 'GET', undefined, true);
    });
  });
});

describe.each<[string, () => Promise<unknown>, unknown[]]>([
  ['logoutRequest', () => logoutRequest(), ['/logout', 'POST']],
  ['listTimezones', () => listTimezones(), ['/timezone_list', 'GET']],
  ['getCurrentWifi', () => getCurrentWifi(), ['/wifi', 'GET']],
  ['wifiScan', () => wifiScan(), ['/wifi_list', 'GET']],
  ['resetWifi', () => resetWifi(), ['/wifi', 'DELETE']],
  [
    'setSshEnabled(true)',
    () => setSshEnabled(true),
    ['/ssh_access_enable', 'PUT', { enable: true }],
  ],
  [
    'setSshEnabled(false)',
    () => setSshEnabled(false),
    ['/ssh_access_enable', 'PUT', { enable: false }],
  ],
  [
    'addSshKey',
    () => addSshKey('ssh-rsa AAAA...'),
    ['/ssh_access_credentials', 'POST', { key: 'ssh-rsa AAAA...' }],
  ],
  [
    'setWebsocketEnabled(true)',
    () => setWebsocketEnabled(true),
    ['/websocket_api', 'PUT', { enable: true }],
  ],
  [
    'setWebsocketEnabled(false)',
    () => setWebsocketEnabled(false),
    ['/websocket_api', 'PUT', { enable: false }],
  ],
  ['getHomekitStatus', () => getHomekitStatus(), ['/ap', 'GET']],
  ['resetHomekit', () => resetHomekit(), ['/homekit', 'DELETE']],
])('passthrough — %s', (_name, call, expected) => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards to apiFetch with expected args', async () => {
    mockApiFetch.mockResolvedValue(undefined);
    await call();
    expect(mockApiFetch).toHaveBeenCalledWith(...expected);
  });
});
