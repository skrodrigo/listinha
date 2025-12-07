import { z } from '@hono/zod-openapi';

export const UserSchema = z
  .object({
    id: z.string().openapi({ example: '123' }),
    email: z.string().email().openapi({ example: 'user@example.com' }),
  })
  .openapi('User');
