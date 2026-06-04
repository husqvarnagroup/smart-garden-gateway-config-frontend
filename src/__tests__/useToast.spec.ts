import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { useToast } from '@/composables/useToast';

describe('useToast', () => {
  const clearToasts = () => {
    const { toasts } = useToast();
    toasts.splice(0, toasts.length);
  };

  beforeEach(() => {
    clearToasts();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('error/success/info push toasts of the matching type with the given message', () => {
    const { error, success, info, toasts } = useToast();
    error('boom');
    success('ok');
    info('fyi');
    expect(toasts.map((t) => ({ type: t.type, message: t.message }))).toEqual([
      { type: 'error', message: 'boom' },
      { type: 'success', message: 'ok' },
      { type: 'info', message: 'fyi' },
    ]);
  });

  it('assigns a unique id to each toast', () => {
    const { error, toasts } = useToast();
    error('a');
    error('b');
    error('c');
    const ids = toasts.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('dismiss removes only the toast with the given id', () => {
    const { error, dismiss, toasts } = useToast();
    error('a');
    error('b');
    error('c');
    const targetId = toasts[1]!.id;
    dismiss(targetId);
    expect(toasts.map((t) => t.message)).toEqual(['a', 'c']);
  });

  it('dismiss is a no-op when the id is not present', () => {
    const { error, dismiss, toasts } = useToast();
    error('a');
    const before = toasts.length;
    dismiss(99999);
    expect(toasts.length).toBe(before);
  });

  it('auto-dismisses each toast after the default 4s timer', () => {
    const { success, toasts } = useToast();
    success('one');
    expect(toasts.length).toBe(1);
    vi.advanceTimersByTime(3999);
    expect(toasts.length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(toasts.length).toBe(0);
  });
});
