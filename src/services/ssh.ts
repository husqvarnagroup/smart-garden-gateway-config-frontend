import { apiFetch } from '@/services/api';

export const setSshEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/ssh_access_enable', 'PUT', { enable });
