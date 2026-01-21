import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  personalNumber: z.number(),
  isAdmin: z.boolean(),
});

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
