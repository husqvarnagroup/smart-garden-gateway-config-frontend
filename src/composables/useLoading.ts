import { ref } from 'vue';

export const useLoading = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    loading.value = true;
    error.value = null;
    try {
      return await fn();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, withLoading };
};
