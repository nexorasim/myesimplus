import { Hono } from 'hono';

const staticRoutes = new Hono();

staticRoutes.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyeSIMPlus - Global eSIM Solutions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 4rem 2rem; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .cta-button { background: #e74c3c; color: white; border: none; padding: 1rem 2rem; font-size: 1.1rem; border-radius: 5px; cursor: pointer; }
        .plans { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; }
        .plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .plan-card { background: white; border-radius: 10px; padding: 2rem; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        footer { background: #2c3e50; color: white; text-align: center; padding: 2rem; }
    </style>
</head>
<body>
    <section class="hero">
        <h1>MyeSIMPlus</h1>
        <p>Global eSIM Solutions for Travelers</p>
        <button class="cta-button">Get Started</button>
    </section>
    
    <section class="plans">
        <h2>Our Plans</h2>
        <div id="plan-grid" class="plan-grid"></div>
    </section>
    
    <footer>
        <p>&copy; 2024 MyeSIMPlus. All rights reserved.</p>
    </footer>
    
    <script>
        fetch('/api/plans')
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('plan-grid').innerHTML = data.data.map(plan => 
                        '<div class="plan-card"><h3>' + plan.name + '</h3><p>$' + plan.price + '</p><p>' + plan.data + ' • ' + plan.validity + '</p></div>'
                    ).join('');
                }
            });
    </script>
</body>
</html>`;

  return c.html(html);
});

export { staticRoutes };