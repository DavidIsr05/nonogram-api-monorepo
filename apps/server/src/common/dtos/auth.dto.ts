import { createZodDto } from 'nestjs-zod';
import {
  UserSignInSchema,
  UserResponseSchema,
} from '@nonogram-api-monorepo/types';

export class UserSignInDto extends createZodDto(UserSignInSchema) {}
export class UserResponseDto extends createZodDto(UserResponseSchema) {}
