import { computed, ref } from 'vue';

export const useAsync = () => {
  const count = ref(0);
  const pending = computed(() => count.value > 0);

  const run = async <R>(fn: () => Promise<R>): Promise<R> => {
    count.value++;
    try {
      return await fn();
    } finally {
      count.value--;
    }
  };

  return { pending, run };
};
