import { createZodDto } from 'nestjs-zod';
import z from 'zod';
import { TileStates } from '../enums';

export const CheckAndUpdateInProgressNonogramSchema = z.object({
  inProgressNonogram: z.array(z.array(z.nativeEnum(TileStates))).nullable(),
  gameId: z.string().uuid(),
});

export class CheckAndUpdateInProgressNonogramDto extends createZodDto(
  CheckAndUpdateInProgressNonogramSchema
) {}
