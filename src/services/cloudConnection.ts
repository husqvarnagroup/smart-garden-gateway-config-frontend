// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { apiFetch } from '@/services/api';

export type CloudConnectionConfig = { enabled: boolean };

export const getCloudConnectionEnabled = (): Promise<CloudConnectionConfig> =>
  apiFetch<CloudConnectionConfig>('/cloud_connection', 'GET');

export const setCloudConnectionEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/cloud_connection', 'PUT', { enabled: enable });
