import z from 'zod';
import { GameSchema } from '../db-schemas';
import { NonogramDifficultiesEnumValues } from '../enums';

export const GameWithCluesResponseSchema = GameSchema.extend({
  rowClues: z.array(z.array(z.number())),
  colClues: z.array(z.array(z.number())),
  nonogramName: z.string(),
  nonogramDifficulty: NonogramDifficultiesEnumValues,
}).strip();

export type GameWithCluesResponseType = z.infer<
  typeof GameWithCluesResponseSchema
>;
