import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import type { PrismaClient } from '@/generated/prisma/client.js';

import { auth } from '@/common/auth.js';
import { withPrisma } from '@/common/prisma.js';
import { env } from '@/common/env.js';
import { errorHandler } from '@/middlewares/error-handler.middleware.js';

import routes from './routes/routes.js';

type AppVariables = {
  prisma: PrismaClient;
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{ Variables: AppVariables }>();

// Middlewares Globais
app.onError(errorHandler);
app.use('*', withPrisma);
app.use('*', cors({
  origin: ['http://localhost:8081', 'exp://*'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Monta todas as rotas
app.route('/', routes);

const port = parseInt(env.PORT, 10);

console.log(`🔥 Server running on http://localhost:${port}`);
console.log(`📚 Swagger UI: http://localhost:${port}/swagger`);

serve({
  fetch: app.fetch,
  port,
});

export default app;