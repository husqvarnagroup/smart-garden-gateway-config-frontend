// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { apiFetch } from '@/services/api';

export type TelemetryConsentConfig = { enabled: boolean };

export const getTelemetryConsent = (): Promise<TelemetryConsentConfig> =>
  apiFetch<TelemetryConsentConfig>('/consent_telemetry', 'GET');

export const setTelemetryConsent = (enable: boolean): Promise<void> =>
  apiFetch<void>('/consent_telemetry', 'PUT', { enabled: enable });
