import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegisterData = z.infer<typeof RegisterSchema>;
export type LoginData = z.infer<typeof LoginSchema>;
