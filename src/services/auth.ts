type LoginResponse = {
  session: string
}

type ErrorResponse = {
  message?: string
}

const LOGIN_URL = '/login'

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
