import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const generatedNonogramResponseSchema = z
  .object({
    nonogram: z.array(z.array(z.boolean())),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    mainObjectDimFactor: z.number(),
    difficulty: NonogramDifficultiesEnumValues,
  })
  .strict();

export class generatedNonogramResponseDto extends createZodDto(
  generatedNonogramResponseSchema
) {}
