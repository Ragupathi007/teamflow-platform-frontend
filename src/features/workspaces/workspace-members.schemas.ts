import { z } from 'zod'

export const assignableWorkspaceMemberRoleSchema = z.enum(['admin', 'member'])

export const addWorkspaceMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please provide a valid email address')
    .toLowerCase(),
  role: assignableWorkspaceMemberRoleSchema,
})

export const updateWorkspaceMemberSchema = z.object({
  role: assignableWorkspaceMemberRoleSchema,
})

export type AddWorkspaceMemberFormValues = z.infer<
  typeof addWorkspaceMemberSchema
>

export type UpdateWorkspaceMemberFormValues = z.infer<
  typeof updateWorkspaceMemberSchema
>
