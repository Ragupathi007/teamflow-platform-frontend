import { z } from 'zod'

export const workspaceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must contain at least 2 characters')
    .max(150, 'Workspace name cannot exceed 150 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters'),
})

export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>
