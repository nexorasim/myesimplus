/**
 * Rate limiter middleware for Cloudflare Workers
 * Uses KV storage to track request counts per IP
 */

export const rateLimiter = async (c, next) => {
  const ip = c.req.header('CF-Connecting-IP') || 
             c.req.header('X-Forwarded-For') || 
             'unknown';
  
  const windowMs = parseInt(c.env.RATE_LIMIT_WINDOW) || 900000; // 15 minutes
  const maxRequests = parseInt(c.env.RATE_LIMIT_MAX) || 100;
  
  const key = `rate_limit:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  try {
    // Get current request data from KV
    const data = await c.env.ANALYTICS?.get(key);
    let requests = data ? JSON.parse(data) : [];
    
    // Remove old requests outside the window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    if (requests.length >= maxRequests) {
      return c.json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} per ${windowMs / 1000} seconds`,
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
      }, 429, {
        'Retry-After': Math.ceil((requests[0] + windowMs - now) / 1000).toString(),
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil((requests[0] + windowMs) / 1000).toString()
      });
    }
    
    // Add current request
    requests.push(now);
    
    // Store updated data
    await c.env.ANALYTICS?.put(key, JSON.stringify(requests), {
      expirationTtl: Math.ceil(windowMs / 1000)
    });
    
    // Add rate limit headers
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', (maxRequests - requests.length).toString());
    c.header('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000).toString());
    
  } catch (error) {
    console.error('Rate limiter error:', error);
    // Continue on error to avoid blocking legitimate requests
  }
  
  await next();
};