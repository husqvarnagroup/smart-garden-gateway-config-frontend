// SPDX-FileCopyrightText: 2026 GARDENA GmbH
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { createApp } from 'vue';
import I18NextVue from 'i18next-vue';
import App from './App.vue';
import router from './router';
import i18next from './i18n';
import './styles/global.css';

const bootstrap = async () => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  const app = createApp(App);

  app.use(router);
  app.use(I18NextVue, { i18next });

  app.mount('#app');
};

void bootstrap();
