import { reactive } from 'vue';

export type AuthState = {
  session: string | null;
  loading: boolean;
  error: string | null;
};

export const authState = reactive<AuthState>({
  session: null,
  loading: false,
  error: null,
});

export const resetAuthState = () => {
  authState.session = null;
  authState.loading = false;
  authState.error = null;
};
