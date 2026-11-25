import { z } from 'zod'

export const updateProfileSchema = z.object({
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
})

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>
