import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { cache } from 'hono/cache';

const app = new Hono();

// Security middleware
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https:"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https:"],
  }
}));

app.use('*', cors({
  origin: ['https://myesimplus.com', 'https://www.myesimplus.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use('*', logger());

// Cache static assets
app.use('/static/*', cache({
  cacheName: 'myesimplus-static',
  cacheControl: 'max-age=31536000'
}));

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.get('/api/plans', async (c) => {
  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 9.99,
      data: '1GB',
      validity: '7 days',
      countries: ['US', 'CA', 'MX']
    },
    {
      id: 2,
      name: 'Premium', 
      price: 19.99,
      data: '5GB',
      validity: '30 days',
      countries: ['US', 'CA', 'MX', 'EU', 'UK']
    }
  ];
  
  return c.json(plans);
});

// Contact form
app.post('/api/contact', async (c) => {
  try {
    const data = await c.req.json();
    
    if (!data.email || !data.message) {
      return c.json({ error: 'Email and message required' }, 400);
    }
    
    // Log contact submission
    console.log('Contact form submitted:', data.email);
    
    return c.json({ success: true, message: 'Message received' });
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400);
  }
});

// Static pages
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyeSIMPlus - Global eSIM Solutions</title>
    <meta name="description" content="Premium eSIM solutions for global connectivity">
    <link rel="stylesheet" href="/static/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">MyeSIMPlus</div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#plans">Plans</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home" class="hero">
            <h1>Global eSIM Solutions</h1>
            <p>Stay connected worldwide with premium eSIM services</p>
            <button class="cta-button">Get Started</button>
        </section>
        
        <section id="plans" class="plans">
            <h2>Our Plans</h2>
            <div id="plan-grid" class="plan-grid"></div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 MyeSIMPlus. All rights reserved.</p>
    </footer>
    
    <script src="/static/app.js"></script>
</body>
</html>`);
});

// Static CSS
app.get('/static/styles.css', (c) => {
  const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #2c3e50;
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

nav ul {
    display: flex;
    list-style: none;
    gap: 2rem;
}

nav a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

nav a:hover {
    color: #3498db;
}

main {
    margin-top: 80px;
}

.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 8rem 2rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.cta-button:hover {
    background: #c0392b;
}

.plans {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.plans h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.plan-card {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.plan-card:hover {
    transform: translateY(-5px);
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem;
}`;

  return c.text(css, 200, {
    'Content-Type': 'text/css',
    'Cache-Control': 'public, max-age=31536000'
  });
});

// Static JS
app.get('/static/app.js', (c) => {
  const js = `document.addEventListener('DOMContentLoaded', async function() {
    // Load plans
    try {
        const response = await fetch('/api/plans');
        const plans = await response.json();
        
        const planGrid = document.getElementById('plan-grid');
        planGrid.innerHTML = plans.map(plan => \`
            <div class="plan-card">
                <h3>\${plan.name}</h3>
                <p>\${plan.data} for \${plan.validity}</p>
                <div class="price">$\${plan.price}</div>
            </div>
        \`).join('');
    } catch (error) {
        console.error('Failed to load plans:', error);
    }
    
    // Smooth scrolling
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});`;

  return c.text(js, 200, {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'public, max-age=31536000'
  });
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;