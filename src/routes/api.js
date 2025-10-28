import { Hono } from 'hono';
import { validator, contactSchema, planInquirySchema, newsletterSchema, sanitizeObject } from '../middleware/validator.js';

const api = new Hono();

// Plans endpoint with caching
api.get('/plans', async (c) => {
  const plans = [
    {
      id: 1,
      name: 'Basic Traveler',
      price: 9.99,
      data: '1GB',
      validity: '7 days',
      countries: ['US', 'CA', 'MX'],
      features: ['High-speed data', '24/7 support', 'Instant activation'],
      popular: false
    },
    {
      id: 2,
      name: 'Premium Explorer',
      price: 19.99,
      data: '5GB',
      validity: '30 days',
      countries: ['US', 'CA', 'MX', 'EU', 'UK', 'AU'],
      features: ['High-speed data', '24/7 support', 'Instant activation', 'Hotspot sharing'],
      popular: true
    },
    {
      id: 3,
      name: 'Enterprise Global',
      price: 49.99,
      data: '20GB',
      validity: '90 days',
      countries: ['Global Coverage - 150+ countries'],
      features: ['High-speed data', 'Priority support', 'Instant activation', 'Hotspot sharing', 'Multi-device'],
      popular: false
    },
    {
      id: 4,
      name: 'Unlimited Pro',
      price: 79.99,
      data: 'Unlimited',
      validity: '30 days',
      countries: ['Global Coverage - 150+ countries'],
      features: ['Unlimited data', 'Priority support', 'Instant activation', 'Hotspot sharing', 'Multi-device', 'VPN included'],
      popular: false
    }
  ];

  return c.json({
    success: true,
    data: plans,
    timestamp: new Date().toISOString()
  });
});

// Get specific plan
api.get('/plans/:id', async (c) => {
  const planId = parseInt(c.req.param('id'));
  
  // This would typically come from a database
  const plans = [
    { id: 1, name: 'Basic Traveler', price: 9.99, data: '1GB', validity: '7 days' },
    { id: 2, name: 'Premium Explorer', price: 19.99, data: '5GB', validity: '30 days' },
    { id: 3, name: 'Enterprise Global', price: 49.99, data: '20GB', validity: '90 days' },
    { id: 4, name: 'Unlimited Pro', price: 79.99, data: 'Unlimited', validity: '30 days' }
  ];
  
  const plan = plans.find(p => p.id === planId);
  
  if (!plan) {
    return c.json({ error: 'Plan not found' }, 404);
  }
  
  return c.json({
    success: true,
    data: plan
  });
});

// Contact form submission
api.post('/contact', validator(contactSchema), async (c) => {
  try {
    const data = sanitizeObject(c.req.valid('json'));
    
    // Generate unique ID for the contact
    const contactId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const contactData = {
      id: contactId,
      ...data,
      timestamp,
      ip: c.req.header('CF-Connecting-IP') || 'unknown',
      userAgent: c.req.header('User-Agent') || 'unknown'
    };
    
    // Store in KV
    if (c.env.CONTACTS) {
      await c.env.CONTACTS.put(`contact:${contactId}`, JSON.stringify(contactData));
    }
    
    // Log to analytics
    if (c.env.ANALYTICS_DATASET) {
      c.env.ANALYTICS_DATASET.writeDataPoint({
        blobs: [data.email, data.name, data.subject || 'general'],
        doubles: [Date.now()],
        indexes: ['contact_form']
      }).catch(console.error);
    }
    
    return c.json({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.',
      contactId
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({
      error: 'Failed to submit contact form',
      message: 'Please try again later'
    }, 500);
  }
});

// Plan inquiry
api.post('/inquire', validator(planInquirySchema), async (c) => {
  try {
    const data = sanitizeObject(c.req.valid('json'));
    
    const inquiryId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const inquiryData = {
      id: inquiryId,
      ...data,
      timestamp,
      ip: c.req.header('CF-Connecting-IP') || 'unknown'
    };
    
    // Store inquiry
    if (c.env.CONTACTS) {
      await c.env.CONTACTS.put(`inquiry:${inquiryId}`, JSON.stringify(inquiryData));
    }
    
    return c.json({
      success: true,
      message: 'Plan inquiry received. We will send you detailed information shortly.',
      inquiryId
    });
    
  } catch (error) {
    console.error('Plan inquiry error:', error);
    return c.json({
      error: 'Failed to submit inquiry',
      message: 'Please try again later'
    }, 500);
  }
});

// Newsletter subscription
api.post('/newsletter', validator(newsletterSchema), async (c) => {
  try {
    const data = sanitizeObject(c.req.valid('json'));
    
    const subscriptionId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    const subscriptionData = {
      id: subscriptionId,
      ...data,
      timestamp,
      active: true
    };
    
    // Store subscription
    if (c.env.CONTACTS) {
      await c.env.CONTACTS.put(`newsletter:${subscriptionId}`, JSON.stringify(subscriptionData));
    }
    
    return c.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return c.json({
      error: 'Failed to subscribe',
      message: 'Please try again later'
    }, 500);
  }
});

// Countries/coverage endpoint
api.get('/coverage', async (c) => {
  const coverage = {
    regions: [
      {
        name: 'North America',
        countries: ['United States', 'Canada', 'Mexico'],
        plans: [1, 2, 3, 4]
      },
      {
        name: 'Europe',
        countries: ['United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands'],
        plans: [2, 3, 4]
      },
      {
        name: 'Asia Pacific',
        countries: ['Japan', 'South Korea', 'Australia', 'Singapore', 'Thailand'],
        plans: [3, 4]
      },
      {
        name: 'Global',
        countries: ['150+ countries worldwide'],
        plans: [3, 4]
      }
    ],
    totalCountries: 150
  };
  
  return c.json({
    success: true,
    data: coverage
  });
});

// Health check for API
api.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'api',
    timestamp: new Date().toISOString(),
    version: c.env.API_VERSION || 'v1'
  });
});

export { api as apiRoutes };