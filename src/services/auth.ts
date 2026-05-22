import { apiFetch } from '@/services/api';

type LoginResponse = {
  session: string;
};

export const loginRequest = async (password: string): Promise<string> => {
  const data = await apiFetch<LoginResponse>('/login', 'POST', { password }, true);
  return data.session;
};

export const logoutRequest = async (): Promise<void> => {
  await apiFetch<void>('/logout', 'POST');
};
