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
    current.value = value;
    snapshot.value = deepCopy(value);
  };

  const change = (value: T) => {
    snapshot.value = deepCopy(current.value);
    current.value = value;
  };

  const saveWithRollback = async <R>(fn: () => Promise<R>): Promise<R> => {
    try {
      const result = await run(fn);
      snapshot.value = deepCopy(current.value);
      return result;
    } catch (error) {
      current.value = snapshot.value;
      throw error;
    }
  };

  return { current, saving, init, change, saveWithRollback };
};
