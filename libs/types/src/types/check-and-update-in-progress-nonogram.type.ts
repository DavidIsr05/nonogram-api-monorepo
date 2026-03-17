import z from 'zod';
import { TileStates } from '../enums';

export const CheckAndUpdateInProgressNonogramSchema = z
  .object({
    inProgressNonogram: z.array(z.array(z.nativeEnum(TileStates))).nullable(),
    timer: z.number(),
    gameId: z.string().uuid(),
  })
  .strict();

export type CheckAndUpdateInProgressNonogramType = z.infer<
  typeof CheckAndUpdateInProgressNonogramSchema
>;
