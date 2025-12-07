import { serve } from '@hono/node-server';
import { env } from '@/common/env.js';
import app from './routes/routes.js';

const port = parseInt(env.PORT, 10);

console.log(`🔥 Server running on http://localhost:${port}`);
console.log(`📚 Swagger UI: http://localhost:${port}/swagger`);

serve({
  fetch: app.fetch,
  port,
});

export default app;