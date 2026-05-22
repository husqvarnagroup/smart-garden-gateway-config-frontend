import { delay, http, HttpResponse } from 'msw'

const MOCK_USER = {
  password: 'pass1234',
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('Missing required VITE_API_BASE_URL environment variable')
}

const LOGIN_URL = new URL('/login', apiBaseUrl).toString()

export const handlers = [
  http.post(LOGIN_URL, async ({ request }) => {
    await delay(400)

    const body = (await request.json()) as { password?: string }

    if (body.password === MOCK_USER.password) {
      return HttpResponse.json({ session: 'mock-session-123' })
    }

    return HttpResponse.json({ message: 'Invalid password' }, { status: 401 })
  }),
]
