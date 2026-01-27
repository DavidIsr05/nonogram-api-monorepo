import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CheckAndUpdateNonogramTileSchema = z.object({
  nonogramXIndex: z.number(),
  nonogramYIndex: z.number(),
  gameId: z.string().uuid(),
});

export class CheckAndUpdateNonogramTileDto extends createZodDto(
  CheckAndUpdateNonogramTileSchema
) {}
