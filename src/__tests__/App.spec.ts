import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('redirects unauthenticated users to login', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await nextTick()

    expect(wrapper.text()).toContain('Login')
  })
})
