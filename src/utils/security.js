/**
 * Security utilities for input validation and sanitization
 */

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(--|\/\*|\*\/|;|'|"|`)/,
  /(\bOR\b|\bAND\b).*?[=<>]/i
];

// XSS patterns
const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^>]*>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi
];

/**
 * Validate email address
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email) && email.length <= 254;
}

/**
 * Validate phone number
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return PHONE_REGEX.test(cleaned);
}

/**
 * Check for SQL injection attempts
 */
export function containsSQLInjection(input) {
  if (!input || typeof input !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check for XSS attempts
 */
export function containsXSS(input) {
  if (!input || typeof input !== 'string') return false;
  return XSS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitize string input
 */
export function sanitizeString(input, maxLength = 1000) {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
}

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(input) {
  if (!input || typeof input !== 'string') return '';
  
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
  
  return input.replace(tagRegex, (match, tagName) => {
    return allowedTags.includes(tagName.toLowerCase()) ? match : '';
  });
}

/**
 * Validate and sanitize contact form data
 */
export function validateContactData(data) {
  const errors = [];
  const sanitized = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else {
    const name = sanitizeString(data.name, 100);
    if (name.length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (containsXSS(name) || containsSQLInjection(name)) {
      errors.push('Name contains invalid characters');
    } else {
      sanitized.name = name;
    }
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const email = sanitizeString(data.email, 254).toLowerCase();
    if (!isValidEmail(email)) {
      errors.push('Invalid email address');
    } else {
      sanitized.email = email;
    }
  }
  
  // Phone validation (optional)
  if (data.phone) {
    const phone = sanitizeString(data.phone, 20);
    if (phone && !isValidPhone(phone)) {
      errors.push('Invalid phone number');
    } else if (phone) {
      sanitized.phone = phone;
    }
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else {
    const message = sanitizeString(data.message, 2000);
    if (message.length < 10) {
      errors.push('Message must be at least 10 characters');
    } else if (containsXSS(message) || containsSQLInjection(message)) {
      errors.push('Message contains invalid characters');
    } else {
      sanitized.message = message;
    }
  }
  
  // Subject validation (optional)
  if (data.subject) {
    const subject = sanitizeString(data.subject, 200);
    if (containsXSS(subject) || containsSQLInjection(subject)) {
      errors.push('Subject contains invalid characters');
    } else {
      sanitized.subject = subject;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    data: sanitized
  };
}

/**
 * Rate limiting helper
 */
export function createRateLimitKey(ip, endpoint) {
  return `rate_limit:${ip}:${endpoint}`;
}

/**
 * Generate secure random string
 */
export function generateSecureId(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
}

/**
 * Hash sensitive data
 */
export async function hashData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate IP address
 */
export function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false;
  
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return true; // Allow requests without origin (same-origin)
  return allowedOrigins.includes(origin);
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};