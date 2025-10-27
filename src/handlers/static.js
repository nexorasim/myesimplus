export async function handleStatic(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Cache static assets for 1 year
  const cacheHeaders = {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'ETag': `"${Date.now()}"`,
  };

  // Handle root path
  if (path === '/' || path === '/index.html') {
    return new Response(getIndexHTML(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300', // 5 minutes for HTML
      }
    });
  }

  // Handle CSS files
  if (path.endsWith('.css')) {
    return new Response(getCSS(), {
      headers: {
        'Content-Type': 'text/css',
        ...cacheHeaders
      }
    });
  }

  // Handle JS files
  if (path.endsWith('.js')) {
    return new Response(getJS(), {
      headers: {
        'Content-Type': 'application/javascript',
        ...cacheHeaders
      }
    });
  }

  // 404 for other paths
  return new Response('Not Found', { status: 404 });
}

function getIndexHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyeSIMPlus - Global eSIM Solutions</title>
    <meta name="description" content="Get connected worldwide with MyeSIMPlus eSIM solutions">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">MyeSIMPlus</div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#plans">Plans</a></li>
                <li><a href="#coverage">Coverage</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home" class="hero">
            <h1>Global eSIM Solutions</h1>
            <p>Stay connected anywhere in the world with our premium eSIM services</p>
            <button class="cta-button">Get Started</button>
        </section>
        
        <section id="plans" class="plans">
            <h2>Our Plans</h2>
            <div class="plan-grid">
                <div class="plan-card">
                    <h3>Basic</h3>
                    <p>Perfect for short trips</p>
                    <div class="price">$9.99</div>
                </div>
                <div class="plan-card">
                    <h3>Premium</h3>
                    <p>For extended travel</p>
                    <div class="price">$19.99</div>
                </div>
                <div class="plan-card">
                    <h3>Enterprise</h3>
                    <p>Business solutions</p>
                    <div class="price">$49.99</div>
                </div>
            </div>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 MyeSIMPlus. All rights reserved.</p>
    </footer>
    
    <script src="/app.js"></script>
</body>
</html>`;
}

function getCSS() {
  return `* {
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

.hero p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
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

.plan-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.price {
    font-size: 2rem;
    font-weight: bold;
    color: #e74c3c;
    margin-top: 1rem;
}

footer {
    background: #2c3e50;
    color: white;
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 2rem;
    }
    
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    nav ul {
        gap: 1rem;
    }
}`;
}

function getJS() {
  return `document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA button click handler
    document.querySelector('.cta-button').addEventListener('click', function() {
        alert('Welcome to MyeSIMPlus! Contact us to get started.');
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});`;
}