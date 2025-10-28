import { describe, it, expect, beforeEach } from 'vitest';
import app from '../src/index.js';

describe('API Endpoints', () => {
  let env;

  beforeEach(() => {
    env = {
      ENVIRONMENT: 'test',
      API_VERSION: 'v1',
      CONTACTS: {
        get: async () => null,
        put: async () => {},
      },
      ANALYTICS: {
        get: async () => null,
        put: async () => {},
      },
      ANALYTICS_DATASET: {
        writeDataPoint: async () => {},
      },
    };
  });

  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const req = new Request('http://localhost/health');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.version).toBe('1.0.0');
    });

    it('should return API health status', async () => {
      const req = new Request('http://localhost/api/health');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.service).toBe('api');
    });
  });

  describe('Plans API', () => {
    it('should return all plans', async () => {
      const req = new Request('http://localhost/api/plans');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    it('should return specific plan', async () => {
      const req = new Request('http://localhost/api/plans/1');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(1);
    });

    it('should return 404 for non-existent plan', async () => {
      const req = new Request('http://localhost/api/plans/999');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe('Plan not found');
    });
  });

  describe('Contact API', () => {
    it('should accept valid contact form', async () => {
      const contactData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message with enough characters.',
      };

      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.contactId).toBeDefined();
    });

    it('should reject invalid contact form', async () => {
      const contactData = {
        name: 'A', // Too short
        email: 'invalid-email',
        message: 'Short', // Too short
      };

      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Validation Error');
      expect(data.details).toBeDefined();
    });
  });

  describe('Coverage API', () => {
    it('should return coverage information', async () => {
      const req = new Request('http://localhost/api/coverage');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.regions).toBeDefined();
      expect(Array.isArray(data.data.regions)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints', async () => {
      const req = new Request('http://localhost/api/non-existent');
      const res = await app.fetch(req, env);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe('Not Found');
    });

    it('should handle CORS preflight requests', async () => {
      const req = new Request('http://localhost/api/plans', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://myesimplus.com',
          'Access-Control-Request-Method': 'GET',
        },
      });

      const res = await app.fetch(req, env);

      expect(res.status).toBe(200);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeTruthy();
    });
  });
});