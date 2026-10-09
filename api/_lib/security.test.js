import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import test from 'node:test';
import contactHandler from '../contact.js';
import { checkRateLimit, isAllowedOrigin, isApiKeyValid } from './security.js';

test('origin allowlist accepts only exact configured origins', () => {
  const previousOrigins = process.env.ALLOWED_ORIGINS;
  process.env.ALLOWED_ORIGINS = 'https://nirvana.example';

  try {
    assert.equal(isAllowedOrigin('https://nirvana.example'), true);
    assert.equal(isAllowedOrigin('https://other-app.vercel.app'), false);
    assert.equal(isAllowedOrigin('https://nirvana.example.attacker.test'), false);
    assert.equal(isAllowedOrigin('http://localhost.evil.test:5173'), false);
    assert.equal(isAllowedOrigin('http://localhost:5173/path'), false);
  } finally {
    if (previousOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = previousOrigins;
  }
});

test('API key comparison requires an exact match', () => {
  assert.equal(isApiKeyValid('correct-secret', 'correct-secret'), true);
  assert.equal(isApiKeyValid('incorrect-secret', 'correct-secret'), false);
  assert.equal(isApiKeyValid('', 'correct-secret'), false);
});

test('rate limiter blocks requests after the configured threshold', () => {
  const req = { headers: {}, socket: { remoteAddress: '203.0.113.77' } };
  const options = { windowMs: 60000, maxRequests: 2, keyPrefix: 'security-test' };

  assert.equal(checkRateLimit(req, options), true);
  assert.equal(checkRateLimit(req, options), true);
  assert.equal(checkRateLimit(req, options), false);
});

test('contact endpoint rejects untrusted origins and accepts an exact origin or valid key', async () => {
  const env = ['ALLOWED_ORIGINS', 'API_KEY', 'CONTACT_API_KEY', 'DATABASE_URL']
    .map((key) => [key, process.env[key]]);
  process.env.ALLOWED_ORIGINS = 'https://nirvana.example';
  process.env.CONTACT_API_KEY = 'test-contact-secret';
  delete process.env.API_KEY;
  delete process.env.DATABASE_URL;

  const callContact = async (headers, remoteAddress) => {
    const req = Object.assign(new EventEmitter(), {
      method: 'POST',
      headers,
      socket: { remoteAddress },
    });
    const res = {
      statusCode: 0,
      headers: {},
      setHeader(key, value) { this.headers[key] = value; },
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; return this; },
      end() {},
    };
    const pending = contactHandler(req, res);
    req.emit('data', Buffer.from(JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a valid test inquiry.',
    })));
    req.emit('end');
    await pending;
    return res;
  };

  try {
    assert.equal((await callContact({ origin: 'https://other-app.vercel.app' }, '203.0.113.78')).statusCode, 401);
    assert.equal((await callContact({ origin: 'http://localhost.evil.test:5173' }, '203.0.113.79')).statusCode, 401);
    assert.equal((await callContact({ origin: 'https://nirvana.example' }, '203.0.113.80')).statusCode, 503);
    assert.equal((await callContact({ 'x-api-key': 'test-contact-secret' }, '203.0.113.81')).statusCode, 503);
  } finally {
    for (const [key, value] of env) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});