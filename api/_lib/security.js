const rateLimitBuckets = new Map();

export function getClientIdentifier(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }

  return req.socket?.remoteAddress || 'unknown-client';
}

export function checkRateLimit(req, { windowMs = 60000, maxRequests = 20, keyPrefix = 'public' } = {}) {
  const identifier = `${keyPrefix}:${getClientIdentifier(req)}`;
  const now = Date.now();
  const bucket = rateLimitBuckets.get(identifier) || [];
  const validEntries = bucket.filter((timestamp) => now - timestamp < windowMs);

  if (validEntries.length >= maxRequests) {
    return false;
  }

  validEntries.push(now);
  rateLimitBuckets.set(identifier, validEntries);
  return true;
}

export function applyCors(req, res, customOrigins = []) {
  const requestOrigin = req.headers.origin;
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    ...customOrigins,
  ]);

  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  configuredOrigins.forEach((origin) => allowedOrigins.add(origin));

  const originAllowed = requestOrigin && (
    allowedOrigins.has(requestOrigin) ||
    requestOrigin.endsWith('.vercel.app') ||
    requestOrigin.endsWith('.vercel.app/')
  );

  if (originAllowed) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

export function setSecurityHeaders(res) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; frame-ancestors 'none';");
}

export function readJsonBody(req, maxSizeBytes = 10000) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxSizeBytes) {
        reject(new Error('Request body exceeds the allowed size limit.'));
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (!chunks.length) {
        resolve({});
        return;
      }

      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    req.on('error', () => reject(new Error('Unable to read request body.')));
  });
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function getDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

export function getModeFromConfig() {
  return getDatabaseConfigured() ? 'connected' : 'demo';
}
