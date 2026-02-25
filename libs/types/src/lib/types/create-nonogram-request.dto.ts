import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const CreateNonogramRequestSchema = z
  .object({
    nonogram: z.string(),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    mainObjectDimFactor: z.number(),
    difficulty: NonogramDifficultiesEnumValues,
    creatorId: z.string().uuid(),
    isPrivate: z.boolean().default(true),
  })
  .strict();

export type CreateNonogramRequestDto = z.infer<typeof CreateNonogramRequestSchema>;
