// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { apiFetch } from '@/services/api';

export const changePassword = (currentPassword: string, newPassword: string): Promise<void> =>
  apiFetch<void>('/password', 'PUT', {
    current_password: currentPassword,
    password: newPassword,
  });

export const resetPassword = (currentPassword: string): Promise<void> =>
  apiFetch<void>('/password', 'DELETE', { current_password: currentPassword });
