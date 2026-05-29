import { reactive } from 'vue';

export type ToastType = 'error' | 'success' | 'info';

export type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

let nextId = 0;

const toasts = reactive<Toast[]>([]);

const dismiss = (id: number) => {
  const idx = toasts.findIndex((t) => t.id === id);
  if (idx !== -1) toasts.splice(idx, 1);
};

const add = (type: ToastType, message: string, duration = 4000) => {
  const id = nextId++;
  toasts.push({ id, type, message });
  setTimeout(() => dismiss(id), duration);
};

export const useToast = () => ({
  toasts,
  dismiss,
  error: (message: string) => add('error', message),
  success: (message: string) => add('success', message),
  info: (message: string) => add('info', message),
});
