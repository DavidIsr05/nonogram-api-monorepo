import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const NonogramResponseSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    previewImageBase64: z.string(),
    completeNonogramImageBase64: z.string(),
    mainObjectDimFactor: z.number(),
    difficulty: NonogramDifficultiesEnumValues,
    creatorId: z.string().uuid(),
    isPrivate: z.boolean().default(true),
    likeCount: z.coerce.number().int().optional(),
    gameCount: z.coerce.number().int().optional(),
    user: z.object({ username: z.string() }).optional(),
  })
  .strip();

export type NonogramResponseType = z.infer<typeof NonogramResponseSchema>;
