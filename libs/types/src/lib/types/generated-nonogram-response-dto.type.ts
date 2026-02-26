import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const GeneratedNonogramResponseSchema = z
  .object({
    nonogram: z.boolean().array().array().or(z.string()),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    mainObjectDimFactor: z.number(),
    difficulty: NonogramDifficultiesEnumValues,
  })
  .strict();

export type GeneratedNonogramResponseDto = z.infer<
  typeof GeneratedNonogramResponseSchema
>;
