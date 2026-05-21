import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const bootstrap = async () => {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    const { worker } = await import('@/mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const app = createApp(App)

  app.use(router)

  app.mount('#app')
}

void bootstrap()
