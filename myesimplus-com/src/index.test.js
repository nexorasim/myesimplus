import { describe, it, expect } from 'vitest';
import app from './index.js';

describe('MyeSIMPlus API', () => {
  it('should return health status', async () => {
    const req = new Request('http://localhost/health');
    const res = await app.fetch(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.status).toBe('healthy');
  });

  it('should return plans', async () => {
    const req = new Request('http://localhost/api/plans');
    const res = await app.fetch(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('should handle contact form', async () => {
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        message: 'Test message'
      })
    });
    
    const res = await app.fetch(req, {
      CACHE: {
        put: async () => {},
        get: async () => null
      }
    });
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should return 404 for unknown routes', async () => {
    const req = new Request('http://localhost/unknown');
    const res = await app.fetch(req);
    
    expect(res.status).toBe(404);
  });
});