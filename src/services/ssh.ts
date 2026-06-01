import { apiFetch } from '@/services/api';

export const setSshEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/ssh_access_enable', 'PUT', { enable });

export const addSshKey = (key: string): Promise<void> =>
  apiFetch<void>('/ssh_access_credentials', 'POST', { key });
