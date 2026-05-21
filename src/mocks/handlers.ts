import { delay, http, HttpResponse } from 'msw'

const MOCK_USER = {
  password: 'pass1234',
}

export const handlers = [
  http.post('/login', async ({ request }) => {
    await delay(400)

    const body = (await request.json()) as { password?: string }

    if (body.password === MOCK_USER.password) {
      return HttpResponse.json({ session: 'mock-session-123' })
    }

    return HttpResponse.json({ message: 'Invalid password' }, { status: 401 })
  }),
]
