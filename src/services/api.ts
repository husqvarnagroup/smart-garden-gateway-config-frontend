// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { authState } from '@/state/auth';

type ErrorResponse = {
  message?: string;
};

const getErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const error = (await response.json().catch(() => null)) as ErrorResponse | null;
    return error?.message ?? `Request failed: ${response.status}`;
  }

  const text = await response.text().catch(() => '');
  return text || `Request failed: ${response.status}`;
};

export const apiFetch = async <T>(
  path: string,
  method: string,
  body?: unknown,
  skipAuth = false,
): Promise<T> => {
  const url = path;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (!skipAuth && authState.session) {
    headers['X-Session'] = authState.session;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authState.session = null;
    }
    throw new Error(await getErrorMessage(response));
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
