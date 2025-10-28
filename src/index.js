import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cache } from 'hono/cache';
import { rateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { validator } from './middleware/validator.js';
import { analytics } from './middleware/analytics.js';
import { apiRoutes } from './routes/api.js';
import { staticRoutes } from './routes/static.js';

const app = new Hono();

// Global middleware stack
app.use('*', logger());

// Analytics tracking
app.use('*', analytics);

// Security headers
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https:"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
  },
  crossOriginEmbedderPolicy: false,
  referrerPolicy: "strict-origin-when-cross-origin",
}));

// CORS configuration
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://myesimplus.com',
      'https://www.myesimplus.com',
      'https://myesimplus-com.advantec.workers.dev',
      'https://myesimplus-com-staging.advantec.workers.dev'
    ];
    
    // Allow localhost for development
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return true;
    }
    
    return allowedOrigins.includes(origin);
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
  maxAge: 86400,
  credentials: true,
}));

// Rate limiting for API endpoints
app.use('/api/*', rateLimiter);

// Cache static assets
app.use('/static/*', cache({
  cacheName: 'myesimplus-static',
  cacheControl: 'public, max-age=31536000, immutable',
}));

// Cache API responses (shorter duration)
app.use('/api/plans', cache({
  cacheName: 'myesimplus-api',
  cacheControl: 'public, max-age=300', // 5 minutes
}));

// Routes
app.route('/api', apiRoutes);
app.route('/', staticRoutes);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: c.env.ENVIRONMENT || 'development',
    uptime: process.uptime ? process.uptime() : 'N/A'
  });
});

// Robots.txt
app.get('/robots.txt', (c) => {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://myesimplus.com/sitemap.xml`;
  
  return c.text(robots, 200, {
    'Content-Type': 'text/plain',
    'Cache-Control': 'public, max-age=86400'
  });
});

// Sitemap.xml
app.get('/sitemap.xml', (c) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://myesimplus.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://myesimplus.com/plans</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  
  return c.text(sitemap, 200, {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=86400'
  });
});

// Global error handler
app.onError(errorHandler);

// 404 handler with proper response
app.notFound((c) => {
  const accept = c.req.header('Accept') || '';
  
  if (accept.includes('application/json')) {
    return c.json({ 
      error: 'Not Found', 
      status: 404,
      path: c.req.path 
    }, 404);
  }
  
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | MyeSIMPlus</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #e74c3c; }
        a { color: #3498db; text-decoration: none; }
    </style>
</head>
<body>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Return to Home</a>
</body>
</html>`, 404);
});

export default app;