/**
 * Analytics middleware for tracking requests and performance
 */

export const analytics = async (c, next) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  // Add request ID to context
  c.set('requestId', requestId);
  
  // Get request metadata
  const metadata = {
    requestId,
    timestamp: startTime,
    method: c.req.method,
    url: c.req.url,
    userAgent: c.req.header('User-Agent') || 'unknown',
    ip: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown',
    country: c.req.header('CF-IPCountry') || 'unknown',
    referer: c.req.header('Referer') || 'direct'
  };
  
  try {
    await next();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log successful request
    const logData = {
      ...metadata,
      status: c.res.status,
      duration,
      success: true
    };
    
    // Write to Analytics Engine if available
    if (c.env.ANALYTICS_DATASET) {
      c.env.ANALYTICS_DATASET.writeDataPoint({
        blobs: [
          metadata.url,
          metadata.method,
          metadata.userAgent,
          metadata.country,
          metadata.referer
        ],
        doubles: [
          startTime,
          duration,
          c.res.status
        ],
        indexes: ['request']
      }).catch(console.error);
    }
    
    // Store in KV for detailed analytics (sample 10% of requests)
    if (Math.random() < 0.1 && c.env.ANALYTICS) {
      const key = `analytics:${new Date().toISOString().split('T')[0]}:${requestId}`;
      c.env.ANALYTICS.put(key, JSON.stringify(logData), {
        expirationTtl: 86400 * 7 // Keep for 7 days
      }).catch(console.error);
    }
    
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log error
    const errorData = {
      ...metadata,
      status: 500,
      duration,
      success: false,
      error: error.message
    };
    
    // Write error to Analytics Engine
    if (c.env.ANALYTICS_DATASET) {
      c.env.ANALYTICS_DATASET.writeDataPoint({
        blobs: [
          metadata.url,
          metadata.method,
          error.message,
          metadata.userAgent
        ],
        doubles: [
          startTime,
          duration,
          500
        ],
        indexes: ['error']
      }).catch(console.error);
    }
    
    throw error; // Re-throw to be handled by error middleware
  }
};