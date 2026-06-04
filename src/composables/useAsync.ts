import { ref } from 'vue';

export const useAsync = (initialPendingState = false) => {
  const pending = ref(initialPendingState);

  const run = async <R>(fn: () => Promise<R>): Promise<R> => {
    pending.value = true;
    try {
      return await fn();
    } finally {
      pending.value = false;
    }
  };

  return { pending, run };
};
