import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from '@/services/api';
import { authState, resetAuthState } from '@/state/auth';

const makeResponse = (body: unknown, status = 200, contentType = 'application/json') =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': contentType },
  });

const makeTextResponse = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain' } });

describe('apiFetch', () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch');

  const headersFor = (callIdx = 0) =>
    fetchSpy.mock.calls[callIdx]![1]!.headers as Record<string, string>;

  beforeEach(() => {
    resetAuthState();
    fetchSpy.mockReset();
  });

  it('sends request to correct path with given method', async () => {
    fetchSpy.mockResolvedValue(makeResponse({}));
    await apiFetch('/test', 'GET');
    expect(fetchSpy).toHaveBeenCalledWith('/test', expect.objectContaining({ method: 'GET' }));
  });

  it('adds X-Session header when session exists and skipAuth is false', async () => {
    fetchSpy.mockResolvedValue(makeResponse({}));
    authState.session = 'my-session';
    await apiFetch('/test', 'GET');
    expect(headersFor()['X-Session']).toBe('my-session');
  });

  it('omits X-Session header when skipAuth is true', async () => {
    fetchSpy.mockResolvedValue(makeResponse({}));
    authState.session = 'my-session';
    await apiFetch('/test', 'GET', undefined, true);
    const headers = headersFor();
    expect(headers['X-Session']).toBeUndefined();
    // No body → no Content-Type either; locks the "headers only for what
    // was sent" branch in api.ts.
    expect(headers['Content-Type']).toBeUndefined();
  });

  it('serialises body as JSON and adds Content-Type header', async () => {
    fetchSpy.mockResolvedValue(makeResponse({}));
    await apiFetch('/test', 'POST', { foo: 'bar' });
    expect(fetchSpy).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        body: JSON.stringify({ foo: 'bar' }),
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
  });

  it('returns parsed JSON on success', async () => {
    fetchSpy.mockResolvedValue(makeResponse({ value: 42 }));
    const result = await apiFetch<{ value: number }>('/test', 'GET');
    expect(result).toEqual({ value: 42 });
  });

  it('returns undefined when response has no JSON content-type', async () => {
    fetchSpy.mockResolvedValue(makeTextResponse('', 200));
    const result = await apiFetch('/test', 'DELETE');
    expect(result).toBeUndefined();
  });

  it('throws with JSON error message on non-ok response', async () => {
    fetchSpy.mockResolvedValue(makeResponse({ message: 'Not found' }, 404));
    await expect(apiFetch('/test', 'GET')).rejects.toThrow('Not found');
  });

  it('throws with text body on non-ok non-JSON response', async () => {
    fetchSpy.mockResolvedValue(makeTextResponse('Bad Request', 400));
    await expect(apiFetch('/test', 'GET')).rejects.toThrow('Bad Request');
  });

  it('throws with status fallback when error body is empty', async () => {
    fetchSpy.mockResolvedValue(makeTextResponse('', 500));
    await expect(apiFetch('/test', 'GET')).rejects.toThrow('Request failed: 500');
  });

  it('clears session on 401', async () => {
    fetchSpy.mockResolvedValue(makeResponse({ message: 'Unauthorized' }, 401));
    authState.session = 'old-token';
    await expect(apiFetch('/test', 'GET')).rejects.toThrow('Unauthorized');
    expect(authState.session).toBeNull();
  });

  it('clears session on 401 even when skipAuth is true', async () => {
    fetchSpy.mockResolvedValue(makeResponse({ message: 'Unauthorized' }, 401));
    authState.session = 'old-token';
    await expect(apiFetch('/test', 'POST', { password: 'x' }, true)).rejects.toThrow(
      'Unauthorized',
    );
    expect(authState.session).toBeNull();
  });

  it('rejects when the network request itself fails', async () => {
    fetchSpy.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(apiFetch('/test', 'GET')).rejects.toThrow('Failed to fetch');
  });
});
