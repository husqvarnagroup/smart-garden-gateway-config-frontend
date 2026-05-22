type LoginResponse = {
  session: string
}

type ErrorResponse = {
  message?: string
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error('Missing required VITE_API_BASE_URL environment variable')
}

const LOGIN_URL = new URL('/login', apiBaseUrl).toString()

const getErrorMessage = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const error = (await response.json().catch(() => null)) as ErrorResponse | null
    return error?.message ?? 'Invalid login'
  }

  const text = await response.text().catch(() => '')
  return text || 'Invalid login'
}

export const loginRequest = async (password: string) => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  const data = (await response.json()) as LoginResponse
  return data.session
}
