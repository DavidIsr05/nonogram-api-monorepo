import { createZodDto } from 'nestjs-zod';
import {
  NonogramSchema,
  CreateNonogramSchema,
  UpdateNonogramSchema,
  CreateNonogramRequestSchema,
  GenerateNonogramSchema,
  GeneratedNonogramResponseSchema,
  GamesForEachNonogramSchema,
} from '@nonogram-api-monorepo/types';

export class NonogramDto extends createZodDto(NonogramSchema) {}
export class CreateNonogramDto extends createZodDto(CreateNonogramSchema) {}
export class UpdateNonogramDto extends createZodDto(UpdateNonogramSchema) {}
export class CreateNonogramRequestDto extends createZodDto(
  CreateNonogramRequestSchema
) {}
export class GenerateNonogramDto extends createZodDto(GenerateNonogramSchema) {}
export class GeneratedNonogramResponseDto extends createZodDto(
  GeneratedNonogramResponseSchema
) {}
export class GamesForEachNonogramDto extends createZodDto(
  GamesForEachNonogramSchema
) {}
