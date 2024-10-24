import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  fullName: z.string().trim().min(1, { message:'Name is required'}),
  username: z.string().trim().min(1, { message:'Username is required'}),
  password: z.string().trim().min(1, { message:'Password is required'})
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
});
export const signInSchema = z.object({
  username: z.string().trim().min(1, { message:'Username is required'}),
  password: z.string().trim().min(1, { message:'Password is required'})
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
});