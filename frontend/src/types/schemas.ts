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
export const updateProfileSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().trim().min(0),
  fullName: z.string().trim().min(0),
  link: z.string().trim().min(0),
  bio: z.string().trim().min(0),
  oldPassword: z.string().trim().optional()
  .refine((val) => !val || (val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[^a-zA-Z0-9]/.test(val)), {
    message:
      'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one special character',
  }),
  newPassword: z.string().trim().optional()
  .refine((val) => !val || (val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[^a-zA-Z0-9]/.test(val)), {
    message:
      'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one special character',
  }),
});