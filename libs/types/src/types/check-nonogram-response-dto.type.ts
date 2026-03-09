import z from 'zod';
import { GameStatus, TileStates } from '../enums';

export const CheckNonogramResponseSchema = z.object({
  board: z.array(z.array(z.nativeEnum(TileStates))),
  status: z.nativeEnum(GameStatus),
});

export type CheckNonogramResponseType = z.infer<
  typeof CheckNonogramResponseSchema
>;
