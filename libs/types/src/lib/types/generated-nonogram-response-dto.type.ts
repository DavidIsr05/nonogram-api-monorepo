import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const GeneratedNonogramResponseSchema = z
  .object({
    nonogram: z.boolean().array().array(),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    mainObjectDimFactor: z.number(),
    difficulty: NonogramDifficultiesEnumValues,
  })
  .strict();

export class GeneratedNonogramResponseDto extends createZodDto(
  GeneratedNonogramResponseSchema
) {}
