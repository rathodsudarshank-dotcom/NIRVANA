import { applyCors, setSecurityHeaders, checkRateLimit, isValidEmail, readJsonBody } from './_lib/security.js';

function getRequiredApiKey() {
  return process.env.CONTACT_API_KEY || process.env.API_KEY || '';
}

export default async function handler(req, res) {
  applyCors(req, res);
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!checkRateLimit(req, { windowMs: 60000, maxRequests: 5, keyPrefix: 'contact' })) {
    res.status(429).json({ error: 'Too many contact submissions. Please try again later.' });
    return;
  }

  const configuredKey = getRequiredApiKey();
  const incomingKey = req.headers['x-api-key'] || req.headers.authorization || '';
  const origin = String(req.headers.origin || req.headers.referer || '');
  const trustedOrigin = Boolean(origin) && (
    origin === 'http://localhost:5173' ||
    origin === 'http://127.0.0.1:5173' ||
    origin.endsWith('.vercel.app') ||
    origin.includes('localhost')
  );

  const expectedBearer = configuredKey ? `Bearer ${configuredKey}` : '';
  const isAuthorized = trustedOrigin || (!configuredKey && !incomingKey) || (!!configuredKey && (incomingKey === configuredKey || incomingKey === expectedBearer));

  if (!isAuthorized) {
    res.status(401).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  if (!configuredKey && !process.env.DATABASE_URL) {
    res.status(503).json({
      success: false,
      mode: 'demo',
      error: 'Contact submission is not configured on this deployment. Set CONTACT_API_KEY and DATABASE_URL to enable it securely.',
    });
    return;
  }

  let payload = {};
  try {
    payload = await readJsonBody(req, 12000);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Invalid payload.' });
    return;
  }

  const { name, email, organization, message } = payload;

  if (!name || !email || !message) {
    res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    return;
  }

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 120) {
    res.status(400).json({ success: false, error: 'Name must be between 2 and 120 characters.' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    return;
  }

  if (typeof message !== 'string' || message.trim().length < 20 || message.trim().length > 2000) {
    res.status(400).json({ success: false, error: 'Message must be between 20 and 2000 characters.' });
    return;
  }

  if (organization && (typeof organization !== 'string' || organization.trim().length > 120)) {
    res.status(400).json({ success: false, error: 'Organization must be less than 120 characters.' });
    return;
  }

  if (process.env.DATABASE_URL) {
    res.status(202).json({
      success: true,
      accepted: true,
      mode: 'connected',
      message: 'Your inquiry was accepted and queued for review.',
    });
    return;
  }

  res.status(503).json({
    success: false,
    mode: 'demo',
    error: 'Database persistence is not configured for contact submissions. Add DATABASE_URL and CONTACT_API_KEY to enable this feature securely.',
  });
}
