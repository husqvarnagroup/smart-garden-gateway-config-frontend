import { apiFetch } from '@/services/api';

export const setWebsocketEnabled = (enable: boolean): Promise<void> =>
  apiFetch<void>('/websocket_api', 'PUT', { enable });
