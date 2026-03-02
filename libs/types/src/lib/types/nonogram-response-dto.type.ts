import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const NonogramResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  previewImageBase64: z.string(),
  completeNonogramImageBase64: z.string(),
  mainObjectDimFactor: z.number(),
  difficulty: NonogramDifficultiesEnumValues,
  creatorId: z.string().uuid(),
  isPrivate: z.boolean().default(true),
  likeCount: z.number().optional(),
});

export type NonogramResponseDto = z.infer<typeof NonogramResponseSchema>;
