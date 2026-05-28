import { computed, ref, type Ref } from 'vue';

export const useAsync = <T = undefined>(initialData?: T) => {
  const count = ref(0);
  const loading = computed(() => count.value > 0);
  const data = ref(initialData) as Ref<T>;

  const load = async <R>(fn: () => Promise<R>): Promise<R> => {
    count.value++;
    try {
      const result = await fn();
      (data as Ref<unknown>).value = result;
      return result;
    } finally {
      count.value--;
    }
  };

  return { loading, data, load };
};
