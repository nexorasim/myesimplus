import { handleRequest } from './handlers/router.js';
import { corsHeaders } from './utils/cors.js';

export default {
  async fetch(request, env, ctx) {
    try {
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: corsHeaders
        });
      }

      const response = await handleRequest(request, env, ctx);
      
      // Add security headers
      const secureResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...response.headers,
          ...corsHeaders,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      });

      return secureResponse;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders
      });
    }
  }
};