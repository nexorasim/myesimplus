import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// Contact form validation schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
  subject: z.string().optional(),
  country: z.string().optional(),
  planInterest: z.enum(['basic', 'premium', 'enterprise', 'custom']).optional()
});

// Plan inquiry validation schema
export const planInquirySchema = z.object({
  planId: z.number().int().positive(),
  email: z.string().email('Invalid email address'),
  country: z.string().min(2, 'Country code required'),
  travelDates: z.object({
    start: z.string().datetime(),
    end: z.string().datetime()
  }).optional(),
  dataNeeds: z.enum(['light', 'moderate', 'heavy']).optional()
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  preferences: z.array(z.enum(['deals', 'updates', 'travel-tips'])).optional()
});

// Validation middleware factory
export const validator = (schema, target = 'json') => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }))
      }, 400);
    }
  });
};

// Input sanitization helpers
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};