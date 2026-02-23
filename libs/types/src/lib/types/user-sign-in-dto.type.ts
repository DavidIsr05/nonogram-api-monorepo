import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const UserSignInSchema = z
  .object({
    personalNumber: z
      .number()
      .refine((val) => `${val}`.length === 7)
      .or(undefined),
    password: z.string(),
  })
  .strict();

export class UserSignInDto extends createZodDto(UserSignInSchema) {}
