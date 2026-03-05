import z from 'zod';
import { TileStates } from '../enums';

export const CheckNonogramResponseSchema = z.object({
  board: z.array(z.array(z.nativeEnum(TileStates))),
  status: z.enum(['LOST', 'WON', 'FINE']),
});

export type CheckNonogramResponseDto = z.infer<typeof CheckNonogramResponseSchema>;
