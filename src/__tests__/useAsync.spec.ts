import { describe, it, expect } from 'vitest';
import { useAsync } from '@/composables/useAsync';

describe('useAsync', () => {
  it('starts with pending false', () => {
    const { pending } = useAsync();
    expect(pending.value).toBe(false);
  });

  it('sets pending true while running, false after', async () => {
    const { pending, run } = useAsync();
    let resolve!: () => void;
    const p = run(() => new Promise<void>((r) => (resolve = r)));
    expect(pending.value).toBe(true);
    resolve();
    await p;
    expect(pending.value).toBe(false);
  });

  it('returns value from fn', async () => {
    const { run } = useAsync();
    const result = await run(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('propagates error and clears pending', async () => {
    const { pending, run } = useAsync();
    await expect(run(() => Promise.reject(new Error('boom')))).rejects.toThrow('boom');
    expect(pending.value).toBe(false);
  });

  it('pending stays true until all concurrent calls resolve', async () => {
    const { pending, run } = useAsync();
    let resolve1!: () => void;
    let resolve2!: () => void;
    const p1 = run(() => new Promise<void>((r) => (resolve1 = r)));
    const p2 = run(() => new Promise<void>((r) => (resolve2 = r)));
    expect(pending.value).toBe(true);
    resolve1();
    await p1;
    expect(pending.value).toBe(true);
    resolve2();
    await p2;
    expect(pending.value).toBe(false);
  });
});
