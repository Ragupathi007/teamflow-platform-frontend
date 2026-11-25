import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please provide a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Please provide a valid email address')
      .max(255, 'Email cannot exceed 255 characters')
      .toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
