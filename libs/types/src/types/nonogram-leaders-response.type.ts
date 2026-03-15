import z from 'zod';
import { NonogramLeadersResponseGameObjectScheme } from './nonogram-leaders-response-game-object.type';

export const NonogramLeadersResponseSchema = z.object({
  id: z.string().uuid(),
  games: z.array(NonogramLeadersResponseGameObjectScheme),
});

export type NonogramLeadersResponseType = z.infer<
  typeof NonogramLeadersResponseSchema
>;
