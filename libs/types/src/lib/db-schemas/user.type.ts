import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    username: z.string().max(16),
    password: z.string(), //TODO update the password field to be encripted
    personalNumber: z.number().refine((val) => `${val}`.length === 7),
    isAdmin: z.boolean().default(false),
    globalScore: z.number().default(0),
    totalPlayTime: z.number().default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  })
  .strict();

export const CreateUserSchema = UserSchema.omit({
  id: true,
  isAdmin: true,
  globalScore: true,
  totalPlayTime: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).strict();

export const UpdateUserSchema = UserSchema.partial();

export class UserDto extends createZodDto(UserSchema) {}

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateuserDto extends createZodDto(UpdateUserSchema) {}

export class SignInDto extends createZodDto(
  UserSchema.extend({
    personalNumber: z.number(),
    password: z.string(), //TODO update the password field to be encripted
  })
) {}
