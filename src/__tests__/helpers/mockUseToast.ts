// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { vi } from 'vitest';

export const mockToastDismiss = vi.fn<(id: number) => void>();
export const mockToastError = vi.fn<(message: string) => void>();
export const mockToastSuccess = vi.fn<(message: string) => void>();
export const mockToastInfo = vi.fn<(message: string) => void>();

export const resetToastMocks = () => {
  mockToastDismiss.mockClear();
  mockToastError.mockClear();
  mockToastSuccess.mockClear();
  mockToastInfo.mockClear();
};

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    toasts: [],
    dismiss: mockToastDismiss,
    error: mockToastError,
    success: mockToastSuccess,
    info: mockToastInfo,
  }),
}));
