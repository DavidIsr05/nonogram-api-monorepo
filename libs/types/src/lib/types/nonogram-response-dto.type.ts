import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const NonogramResponseSchema = z.object({
  id: z.string().uuid(),
  previewImageBase64: z.string(),
  completeNonogramImageBase64: z.string(),
  mainObjectDimFactor: z.number(),
  difficulty: NonogramDifficultiesEnumValues,
  creatorId: z.string().uuid(),
  isPrivate: z.boolean().default(true),
});

export class NonogramResponseDto extends createZodDto(NonogramResponseSchema) {}
