// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { ref, toRaw } from 'vue';

import { useAsync } from '@/composables/useAsync';

export const useOptimisticSubmit = <T = undefined>(initial?: T) => {
  const current = ref<T | undefined>(initial);
  const snapshot = ref<T | undefined>(initial);
  const { pending: saving, run } = useAsync();

  // toRaw(...) removes Vue's proxy wrapper.
  // structuredClone(...) makes a deep copy.
  const deepCopy = <V>(value: V): V => structuredClone(toRaw(value));

  const init = (value: T) => {
    const copy = deepCopy(value);
    current.value = copy;
    snapshot.value = deepCopy(copy);
  };

  const change = (value: T) => {
    snapshot.value = deepCopy(current.value);
    current.value = deepCopy(value);
  };

  const saveWithRollback = async <R>(fn: () => Promise<R>): Promise<R> => {
    try {
      const result = await run(fn);
      snapshot.value = deepCopy(current.value);
      return result;
    } catch (error) {
      current.value = deepCopy(snapshot.value);
      throw error;
    }
  };

  const reset = () => {
    current.value = undefined;
    snapshot.value = undefined;
  };

  return { current, saving, init, change, saveWithRollback, reset };
};
