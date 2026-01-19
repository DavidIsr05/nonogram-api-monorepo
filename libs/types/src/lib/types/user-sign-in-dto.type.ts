import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UserSignInSchema = z
  .object({
    personalNumber: z.number().refine((val) => `${val}`.length === 7),
    password: z.string(), //TODO update the password field to be encripted
  })
  .strict();

export class UserSignInDto extends createZodDto(UserSignInSchema) {}
