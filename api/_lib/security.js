import { timingSafeEqual } from 'node:crypto';

const rateLimitBuckets = new Map();
const MAX_RATE_LIMIT_BUCKETS = 10000;
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

function normalizeOrigin(origin) {
  if (typeof origin !== 'string' || !origin) return '';

  try {
    const parsed = new URL(origin);
    return parsed.origin === origin ? parsed.origin : '';
  } catch {
    return '';
  }
}

export function isAllowedOrigin(origin, customOrigins = []) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin) return false;

  const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim());
  const allowedOrigins = new Set(
    [...DEFAULT_ALLOWED_ORIGINS, ...customOrigins, ...configuredOrigins]
      .map(normalizeOrigin)
      .filter(Boolean),
  );

  return allowedOrigins.has(normalizedOrigin);
}

export function getRequestOrigin(req) {
  const origin = req.headers.origin;
  if (typeof origin === 'string' && origin.trim()) return origin.trim();

  const referer = req.headers.referer;
  if (typeof referer !== 'string' || !referer) return '';

  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

export function isApiKeyValid(candidate, expected) {
  if (typeof candidate !== 'string' || typeof expected !== 'string' || !candidate || !expected) {
    return false;
  }

  const candidateBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  return candidateBuffer.length === expectedBuffer.length && timingSafeEqual(candidateBuffer, expectedBuffer);
}

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
  const bucket = rateLimitBuckets.get(identifier);
  const validEntries = (bucket?.timestamps || []).filter((timestamp) => now - timestamp < windowMs);

  if (validEntries.length >= maxRequests) {
    rateLimitBuckets.set(identifier, {
      timestamps: validEntries,
      expiresAt: validEntries[0] + windowMs,
    });
    return false;
  }

  if (!bucket && rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    for (const [key, value] of rateLimitBuckets) {
      if (value.expiresAt <= now) rateLimitBuckets.delete(key);
    }
    if (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      rateLimitBuckets.delete(rateLimitBuckets.keys().next().value);
    }
  }

  validEntries.push(now);
  rateLimitBuckets.delete(identifier);
  rateLimitBuckets.set(identifier, {
    timestamps: validEntries,
    expiresAt: validEntries[0] + windowMs,
  });
  return true;
}

export function applyCors(req, res, customOrigins = []) {
  const requestOrigin = req.headers.origin;
  if (isAllowedOrigin(requestOrigin, customOrigins)) {
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
      } catch {
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
