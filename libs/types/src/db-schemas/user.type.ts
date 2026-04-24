import { z } from 'zod';

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string().max(16, 'Maximum 16 characters in username'),
    password: z.string(),
    personalNumber: z
      .number()
      .refine(
        (val) => `${val}`.length === 7,
        'Personal number must be 7 characters long'
      )
      .or(z.null()),
    isAdmin: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();

export const CreateUserSchema = UserSchema.omit({
  id: true,
  isAdmin: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateUserSchema = UserSchema.partial()
  .extend({
    currentPassword: z.string().optional().nullable(),
    password: z.string().optional().nullable(),
  })
  .required({ id: true })
  .omit({ isAdmin: true, personalNumber: true })
  .strict();

export type UserType = z.infer<typeof UserSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
