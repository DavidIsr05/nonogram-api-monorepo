import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string().max(16),
    password: z.string(),
    personalNumber: z.number().refine((val) => `${val}`.length === 7),
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

export const UpdateUserSchema = UserSchema.partial();

export class UserDto extends createZodDto(UserSchema) {}

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
