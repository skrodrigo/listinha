import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import type { PrismaClient } from '@/generated/prisma/client.js';
import { auth } from '@/common/auth.js';
import { authMiddleware } from '@/middlewares/jwt.middleware.js';
import listRouter from './lists.js';

type AppVariables = {
  prisma: PrismaClient;
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new OpenAPIHono<{ Variables: AppVariables }>();

app.get('/', (c) => c.json({ message: 'Listinha API up and running!' }));

app.use('/api/auth/*', cors({
  origin: ['http://localhost:8081', 'exp://*', 'http://192.168.100.68:8081'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
}));

app.use('/api/register', cors({
  origin: ['http://localhost:8081', 'exp://*', 'http://192.168.100.68:8081'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'OPTIONS'],
  credentials: true,
}));

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw));

app.post('/api/register', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);
  try {
    return await auth.api.signUpEmail({ body: { email, password, name: email.split('@')[0] }, asResponse: true });
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 400);
  }
});

const api = new OpenAPIHono<{ Variables: AppVariables }>();

api.use('*', authMiddleware);

api.get('/auth/session', (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  return c.json(c.get('session'));
});

api.route('/lists', listRouter);

app.route('/api', api);

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Listinha API',
    description: 'API para gerenciar listas de compras com orçamento',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Development' }],
  tags: [
    { name: 'Lists', description: 'Endpoints para listas de compras' },
    { name: 'Items', description: 'Endpoints para itens da lista' },
    { name: 'Auth', description: 'Endpoints de autenticação' },
  ],
});

app.get('/swagger', swaggerUI({ url: '/docs' }));

export default app;
