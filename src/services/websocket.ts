// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { apiFetch } from '@/services/api';

export type WebsocketConfig = { enabled: boolean };

export const getWebsocketEnabled = (): Promise<WebsocketConfig> =>
  apiFetch<WebsocketConfig>('/websocket_api', 'GET');

export const setWebsocketEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/websocket_api', 'PUT', { enable });
