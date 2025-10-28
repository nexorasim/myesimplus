/**
 * Global error handler middleware
 * Provides consistent error responses and logging
 */

export const errorHandler = (err, c) => {
  console.error('Application Error:', {
    message: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
    headers: Object.fromEntries(c.req.headers.entries()),
    timestamp: new Date().toISOString()
  });

  // Log to analytics if available
  if (c.env.ANALYTICS_DATASET) {
    c.env.ANALYTICS_DATASET.writeDataPoint({
      blobs: [
        c.req.url,
        err.message,
        c.req.method,
        c.req.header('User-Agent') || 'unknown'
      ],
      doubles: [Date.now()],
      indexes: ['error']
    }).catch(console.error);
  }

  // Don't expose internal errors in production
  const isProduction = c.env.ENVIRONMENT === 'production';
  
  if (err.name === 'ValidationError') {
    return c.json({
      error: 'Validation Error',
      message: err.message,
      details: err.details || null
    }, 400);
  }
  
  if (err.name === 'UnauthorizedError') {
    return c.json({
      error: 'Unauthorized',
      message: 'Authentication required'
    }, 401);
  }
  
  if (err.name === 'ForbiddenError') {
    return c.json({
      error: 'Forbidden',
      message: 'Access denied'
    }, 403);
  }
  
  if (err.name === 'NotFoundError') {
    return c.json({
      error: 'Not Found',
      message: 'Resource not found'
    }, 404);
  }

  // Generic server error
  return c.json({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  }, 500);
};