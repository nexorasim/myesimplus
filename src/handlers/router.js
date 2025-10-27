import { handleStatic } from './static.js';
import { handleAPI } from './api.js';

export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // API routes
  if (path.startsWith('/api/')) {
    return handleAPI(request, env, ctx);
  }

  // Static file serving
  return handleStatic(request, env, ctx);
}