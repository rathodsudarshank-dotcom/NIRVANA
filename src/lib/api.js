const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function requestJson(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.error || payload?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export async function getHealth() {
  return requestJson('/api/health');
}

export async function getMonitoringSummary() {
  return requestJson('/api/monitoring/summary');
}

export async function getSensorReadings() {
  return requestJson('/api/monitoring/readings');
}

export async function getAnomalyResults() {
  return requestJson('/api/monitoring/anomalies');
}

export async function getReports() {
  return requestJson('/api/reports');
}

export async function submitContact(payload) {
  return requestJson('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
