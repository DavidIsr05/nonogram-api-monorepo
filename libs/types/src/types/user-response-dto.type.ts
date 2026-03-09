import z from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  personalNumber: z.number(),
  isAdmin: z.boolean(),
});

export type UserResponseType = z.infer<typeof UserResponseSchema>;
