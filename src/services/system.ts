import { apiFetch } from '@/services/api';

export type GatewayVersion = {
  gateway_version: string;
};

export type HomekitStatus = {
  active: boolean;
};

export const getGatewayVersion = (): Promise<GatewayVersion> =>
  apiFetch<GatewayVersion>('/version', 'GET', undefined, true);

export const getHomekitStatus = (): Promise<HomekitStatus> => apiFetch<HomekitStatus>('/ap', 'GET');

export const resetHomekit = (): Promise<void> => apiFetch<void>('/homekit', 'DELETE');
