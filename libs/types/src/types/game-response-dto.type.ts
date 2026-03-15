import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';

export const GameResponseSchema = z.object({
  id: z.string().uuid(),
  timer: z.number(),
  mistakes: z.number(),
  nonogram: z.object({
    difficulty: NonogramDifficultiesEnumValues,
    name: z.string(),
  }),
});

export type GameResponseType = z.infer<typeof GameResponseSchema>;
