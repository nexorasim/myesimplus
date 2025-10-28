import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiRoutes } from './routes/api.js';
import { staticRoutes } from './routes/static.js';

const app = new Hono();

// Global middleware
app.use('*', logger());
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
  crossOriginEmbedderPolicy: false,
}));

app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://myesimplus.com',
      'https://www.myesimplus.com',
      'https://myesimplus-com.advantec.workers.dev'
    ];
    return allowedOrigins.includes(origin) || !origin;
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400,
}));

app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

// Routes
app.route('/api', apiRoutes);
app.route('/', staticRoutes);

// Global error handler
app.onError(errorHandler);

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', status: 404 }, 404);
});

export default app;