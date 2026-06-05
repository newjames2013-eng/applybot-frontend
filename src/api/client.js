const BASE = process.env.REACT_APP_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export function registerUser(payload) {
  return request('/api/users/register', { method: 'POST', body: JSON.stringify(payload) });
}

export function pauseUser(userId) {
  return request('/api/users/pause', { method: 'POST', body: JSON.stringify({ userId }) });
}

export function getStats(userId) {
  return request(`/api/stats/${userId}`);
}

export function getHistory(userId, opts = {}) {
  const params = new URLSearchParams();
  if (opts.limit)    params.set('limit', opts.limit);
  if (opts.status)   params.set('status', opts.status);
  if (opts.dateFrom) params.set('dateFrom', opts.dateFrom);
  const qs = params.toString();
  return request(`/api/history/${userId}${qs ? `?${qs}` : ''}`);
}

export function testAIAnswer(payload) {
  return request('/api/test-ai', { method: 'POST', body: JSON.stringify(payload) });
}

export function checkHealth() {
  return request('/health');
}
