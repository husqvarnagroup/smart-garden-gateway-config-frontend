// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { apiFetch } from '@/services/api';

export type SupportBundleConsentConfig = { enabled: boolean };

export const getSupportBundleConsent = (): Promise<SupportBundleConsentConfig> =>
  apiFetch<SupportBundleConsentConfig>('/consent_support_bundle', 'GET');

export const setSupportBundleConsent = (enable: boolean): Promise<void> =>
  apiFetch<void>('/consent_support_bundle', 'PUT', { enabled: enable });
