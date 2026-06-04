// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, it, expect } from 'vitest';
import { useOptimisticSubmit } from '@/composables/useOptimisticSubmit';

describe('useOptimisticSubmit', () => {
  it('init sets current and snapshot', () => {
    const { current, init } = useOptimisticSubmit<string>();
    init('UTC');
    expect(current.value).toBe('UTC');
  });

  it('change applies new value and keeps old as snapshot', () => {
    const { current, init, change } = useOptimisticSubmit<string>();
    init('UTC');
    change('Europe/Berlin');
    expect(current.value).toBe('Europe/Berlin');
  });

  it('saveWithRollback rolls back to snapshot on failure', async () => {
    const { current, init, change, saveWithRollback } = useOptimisticSubmit<string>();
    init('UTC');
    change('Europe/Berlin');
    await expect(saveWithRollback(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(current.value).toBe('UTC');
  });

  it('saveWithRollback advances snapshot on success', async () => {
    const { current, init, change, saveWithRollback } = useOptimisticSubmit<string>();
    init('UTC');
    change('Europe/Berlin');
    await saveWithRollback(() => Promise.resolve('ok'));

    // snapshot is now 'Europe/Berlin'; a subsequent failure rolls back to it, not 'UTC'
    change('America/New_York');
    await expect(saveWithRollback(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');
    expect(current.value).toBe('Europe/Berlin');
  });

  it('saveWithRollback returns result from fn', async () => {
    const { init, saveWithRollback } = useOptimisticSubmit<string>();
    init('UTC');
    const result = await saveWithRollback(() => Promise.resolve('saved'));
    expect(result).toBe('saved');
  });

  it('accepts initial value via argument', () => {
    const { current } = useOptimisticSubmit<string>('Europe/Zurich');
    expect(current.value).toBe('Europe/Zurich');
  });

  it('does not keep caller references after init', () => {
    const initial = { timezone: 'UTC', meta: { source: 'device' } };
    const { current, init } = useOptimisticSubmit<typeof initial>();

    init(initial);
    initial.timezone = 'Europe/Berlin';
    initial.meta.source = 'user';

    expect(current.value).toEqual({ timezone: 'UTC', meta: { source: 'device' } });
    expect(current.value).not.toBe(initial);
  });

  it('saving is true while saveWithRollback is running, false after', async () => {
    let resolve!: (v: string) => void;
    const { saving, saveWithRollback } = useOptimisticSubmit<string>('UTC');
    const p = saveWithRollback(() => new Promise((r) => (resolve = r)));
    expect(saving.value).toBe(true);
    resolve('ok');
    await p;
    expect(saving.value).toBe(false);
  });

  it('rolls back object state without reusing snapshot references', async () => {
    const { current, init, change, saveWithRollback } = useOptimisticSubmit<{
      timezone: string;
      meta: { source: string };
    }>();

    init({ timezone: 'UTC', meta: { source: 'device' } });
    change({ timezone: 'Europe/Berlin', meta: { source: 'user' } });

    await expect(saveWithRollback(() => Promise.reject(new Error('fail')))).rejects.toThrow('fail');

    expect(current.value).toEqual({ timezone: 'UTC', meta: { source: 'device' } });

    current.value!.meta.source = 'mutated';

    await expect(saveWithRollback(() => Promise.reject(new Error('fail again')))).rejects.toThrow(
      'fail again',
    );
    expect(current.value).toEqual({ timezone: 'UTC', meta: { source: 'device' } });
  });
});
