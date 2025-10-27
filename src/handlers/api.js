export async function handleAPI(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check endpoint
  if (path === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Plans endpoint
  if (path === '/api/plans') {
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
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 49.99,
        data: '20GB',
        validity: '90 days',
        countries: ['Global']
      }
    ];

    return new Response(JSON.stringify(plans), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Contact form endpoint
  if (path === '/api/contact' && request.method === 'POST') {
    try {
      const data = await request.json();
      
      // Basic validation
      if (!data.email || !data.message) {
        return new Response(JSON.stringify({
          error: 'Email and message are required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Store in KV or send email (implementation depends on your setup)
      // For now, just return success
      return new Response(JSON.stringify({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Invalid JSON data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('API endpoint not found', { status: 404 });
}