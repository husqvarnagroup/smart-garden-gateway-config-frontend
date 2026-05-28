import { delay, http, HttpResponse } from 'msw';

const MOCK_USER = {
  password: 'pass1234',
  session: 'mock-session-123',
};

const requireSession = (request: Request) => {
  const session = request.headers.get('X-Session');
  if (session !== MOCK_USER.session) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return null;
};

export const handlers = [
  http.post('/login', async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as { password?: string };
    if (body.password === MOCK_USER.password) {
      return HttpResponse.json({ session: MOCK_USER.session });
    }
    return HttpResponse.json({ message: 'Invalid password' }, { status: 401 });
  }),

  http.post('/logout', async ({ request }) => {
    await delay(200);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json({});
  }),

  http.get('/timezone_list', async ({ request }) => {
    await delay(200);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json([
      'UTC',
      'Europe/Berlin',
      'America/New York',
      'Asia/Tokyo',
      'A really very very very very very very very very very very very very long timezone string',
    ]);
  }),

  http.get('/timezone', async ({ request }) => {
    await delay(200);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json('UTC');
  }),

  http.put('/timezone', async ({ request }) => {
    await delay(600);
    const denied = requireSession(request);
    if (denied) return denied;
    const body = (await request.json()) as { timezone?: string };
    return HttpResponse.json({ timezone: body.timezone ?? 'UTC' });
  }),

  http.get('/wifi_list', async ({ request }) => {
    await delay(600);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json([
      { ssid: 'HomeNetwork', signal: -45, security: 'WPA2' },
      { ssid: '', signal: -15, security: 'WPA2' },
      { ssid: 'GuestNetwork', signal: -70, security: 'WPA2' },
      { ssid: 'OpenNetwork', signal: -80, security: 'none' },
    ]);
  }),

  http.get('/wifi', async ({ request }) => {
    await delay(200);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json({ ssid: 'HomeNetwork', key_mgmt: 'WPA2' });
  }),

  http.put('/wifi', async ({ request }) => {
    await delay(500);
    const denied = requireSession(request);
    if (denied) return denied;
    const body = (await request.json()) as { ssid?: string; key_mgmt?: string };
    return HttpResponse.json({ ssid: body.ssid ?? '', key_mgmt: body.key_mgmt ?? 'none' });
  }),

  http.delete('/wifi', async ({ request }) => {
    await delay(300);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json({});
  }),

  http.get('/version', async () => {
    await delay(100);
    return HttpResponse.json({ gateway_version: '1.2.3-mock' });
  }),

  http.get('/ap', async ({ request }) => {
    await delay(200);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json({ active: true });
  }),

  http.delete('/homekit', async ({ request }) => {
    await delay(400);
    const denied = requireSession(request);
    if (denied) return denied;
    return HttpResponse.json({});
  }),

  http.put('/websocket_api', async ({ request }) => {
    await delay(300);
    const denied = requireSession(request);
    if (denied) return denied;
    return new HttpResponse(null, { status: 204 });
  }),

  http.put('/ssh_access_enable', async ({ request }) => {
    await delay(300);
    const denied = requireSession(request);
    if (denied) return denied;
    return new HttpResponse(null, { status: 204 });
  }),
];
