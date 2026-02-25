import z from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  personalNumber: z.number(),
  isAdmin: z.boolean(),
});

export type UserResponseDto = z.infer<typeof UserResponseSchema>;
