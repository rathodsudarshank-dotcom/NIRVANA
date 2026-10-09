import {
  applyCors,
  checkRateLimit,
  getRequestOrigin,
  isAllowedOrigin,
  isApiKeyValid,
  isValidEmail,
  readJsonBody,
  setSecurityHeaders,
} from './_lib/security.js';

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
  const trustedOrigin = isAllowedOrigin(getRequestOrigin(req));
  const apiKeyCandidates = [req.headers['x-api-key'], req.headers.authorization]
    .filter((value) => typeof value === 'string')
    .flatMap((value) => value.toLowerCase().startsWith('bearer ')
      ? [value.slice(7).trim()]
      : [value]);
  const hasValidApiKey = Boolean(configuredKey) && apiKeyCandidates.some((candidate) => isApiKeyValid(candidate, configuredKey));
  const isAuthorized = trustedOrigin || hasValidApiKey;

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
