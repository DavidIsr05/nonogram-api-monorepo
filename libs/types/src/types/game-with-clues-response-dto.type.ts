import z from 'zod';
import { GameSchema } from '../db-schemas';

export const GameWithCluesResponseSchema = GameSchema.extend({
  rowClues: z.array(z.array(z.number())),
  colClues: z.array(z.array(z.number())),
});

export type GameWithCluesResponseType = z.infer<
  typeof GameWithCluesResponseSchema
>;
