import { apiFetch } from '@/services/api';

export type SshConfig = { enabled: boolean };

export const getSshEnabled = (): Promise<SshConfig> =>
  apiFetch<SshConfig>('/ssh_access_enable', 'GET');

export const setSshEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/ssh_access_enable', 'PUT', { enable });

export const addSshKey = (key: string): Promise<void> =>
  apiFetch<void>('/ssh_access_credentials', 'POST', { key });
