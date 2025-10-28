# MyeSIMPlus - Global eSIM Solutions

[![Deploy Status](https://github.com/NexoraSIM/myesimplus-com/workflows/Deploy%20to%20Cloudflare%20Workers/badge.svg)](https://github.com/NexoraSIM/myesimplus-com/actions)
[![Security Rating](https://img.shields.io/badge/security-A+-green.svg)](https://github.com/NexoraSIM/myesimplus-com)
[![Performance](https://img.shields.io/badge/lighthouse-95%2B-brightgreen.svg)](https://myesimplus-com.advantec.workers.dev)

A modern, high-performance website for MyeSIMPlus global eSIM solutions, built with Cloudflare Workers and optimized for speed, security, and scalability.

## 🚀 Live Deployment

- **Production**: https://myesimplus-com.advantec.workers.dev
- **Staging**: https://myesimplus-com-staging.advantec.workers.dev

## ✨ Features

### 🔒 Security First
- **Input Validation**: Comprehensive validation using Zod schemas
- **XSS Protection**: Advanced XSS and SQL injection prevention
- **Rate Limiting**: IP-based rate limiting with KV storage
- **Security Headers**: Complete security header implementation
- **CORS Protection**: Strict CORS policy with origin validation

### ⚡ Performance Optimized
- **Edge Computing**: Deployed on Cloudflare's global edge network
- **Caching Strategy**: Multi-layer caching for optimal performance
- **Asset Optimization**: Minified CSS/JS with long-term caching
- **Core Web Vitals**: Optimized for Google's Core Web Vitals
- **Lighthouse Score**: 95+ performance score

### 🛠 Developer Experience
- **Modern Stack**: Hono framework with TypeScript support
- **Testing**: Comprehensive test suite with Vitest
- **CI/CD**: Automated deployment with GitHub Actions
- **Code Quality**: ESLint + Prettier for consistent code style
- **Monitoring**: Built-in analytics and error tracking

### 📱 User Experience
- **Responsive Design**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliant
- **Progressive Enhancement**: Works without JavaScript
- **Fast Loading**: Sub-second page load times
- **SEO Optimized**: Complete meta tags and structured data

## 🏗 Architecture

```
src/
├── index.js              # Main application entry point
├── middleware/           # Custom middleware
│   ├── rateLimiter.js   # Rate limiting logic
│   ├── errorHandler.js  # Global error handling
│   ├── validator.js     # Input validation
│   └── analytics.js     # Request analytics
├── routes/              # Route handlers
│   ├── api.js          # API endpoints
│   └── static.js       # Static content
└── utils/              # Utility functions
    └── security.js     # Security utilities
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account
- Wrangler CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NexoraSIM/myesimplus-com.git
   cd myesimplus-com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:8787
   ```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run deploy` | Deploy to production |
| `npm run deploy:staging` | Deploy to staging |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint code |
| `npm run format` | Format code |
| `npm run type-check` | TypeScript type checking |

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Application Configuration
ENVIRONMENT=development
API_VERSION=v1
CONTACT_EMAIL=support@myesimplus.com

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Analytics (Optional)
ANALYTICS_TOKEN=your_analytics_token
```

### Cloudflare Resources

The application requires the following Cloudflare resources:

1. **KV Namespaces**:
   - `CONTACTS` - Store contact form submissions
   - `ANALYTICS` - Store analytics data

2. **R2 Buckets**:
   - `ASSETS` - Store static assets

3. **Analytics Engine** (Optional):
   - `ANALYTICS_DATASET` - Real-time analytics

### Setting up KV Namespaces

```bash
# Create KV namespaces
wrangler kv:namespace create "CONTACTS"
wrangler kv:namespace create "ANALYTICS"

# Create preview namespaces
wrangler kv:namespace create "CONTACTS" --preview
wrangler kv:namespace create "ANALYTICS" --preview
```

Update `wrangler.toml` with the generated namespace IDs.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
test/
├── api.test.js          # API endpoint tests
├── middleware.test.js   # Middleware tests
├── security.test.js     # Security tests
└── integration.test.js  # Integration tests
```

## 🚀 Deployment

### Automatic Deployment

The project uses GitHub Actions for automatic deployment:

- **Staging**: Deployed on every PR and push to `develop`
- **Production**: Deployed on push to `main` branch

### Manual Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy
```

### Deployment Checklist

- [ ] All tests passing
- [ ] Security audit clean
- [ ] Performance benchmarks met
- [ ] Environment variables configured
- [ ] KV namespaces created
- [ ] DNS records configured (if using custom domain)

## 🔒 Security

### Security Features

1. **Input Validation**: All inputs validated using Zod schemas
2. **XSS Prevention**: Comprehensive XSS filtering
3. **SQL Injection Protection**: Input sanitization
4. **Rate Limiting**: IP-based rate limiting
5. **Security Headers**: Complete security header implementation
6. **CORS Protection**: Strict origin validation

### Security Headers

The application implements the following security headers:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

### Reporting Security Issues

Please report security vulnerabilities to: security@myesimplus.com

## 📊 Performance

### Performance Metrics

- **Lighthouse Performance**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Optimization Techniques

1. **Edge Caching**: Static assets cached at edge locations
2. **Resource Optimization**: Minified CSS/JS with compression
3. **Image Optimization**: WebP format with fallbacks
4. **Critical CSS**: Inline critical CSS for faster rendering
5. **Preloading**: Strategic resource preloading

## 🔍 Monitoring

### Analytics

The application includes built-in analytics:

- Request tracking
- Performance monitoring
- Error logging
- User behavior analytics

### Health Checks

- `/health` - Application health status
- `/api/health` - API health status

### Logging

Structured logging with the following levels:
- `ERROR` - Application errors
- `WARN` - Warning conditions
- `INFO` - General information
- `DEBUG` - Debug information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/NexoraSIM/myesimplus-com/wiki)
- **Issues**: [GitHub Issues](https://github.com/NexoraSIM/myesimplus-com/issues)
- **Email**: support@myesimplus.com

## 🙏 Acknowledgments

- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge computing platform
- [Hono](https://hono.dev/) - Lightweight web framework
- [Vitest](https://vitest.dev/) - Testing framework
- [Zod](https://zod.dev/) - Schema validation

---

**Built with ❤️ by the MyeSIMPlus Team**