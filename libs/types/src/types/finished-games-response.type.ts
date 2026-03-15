import z from 'zod';
import { GameSchema } from '../db-schemas';

export const FinishedGamesResponseSchema = GameSchema.extend({
  nonogram: z.object({
    completeNonogramImageBase64: z.string(),
    name: z.string(),
  }),
});

export type FinishedGamesResponseType = z.infer<
  typeof FinishedGamesResponseSchema
>;
