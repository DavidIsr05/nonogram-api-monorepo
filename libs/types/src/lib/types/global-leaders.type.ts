import z from 'zod';
import { NonogramDifficultiesEnumValues } from '../enums';
import { createZodDto } from 'nestjs-zod';

export const gamesCountForEachNonogramSchema = z.object({
  id: z.string().uuid(),
  difficulty: NonogramDifficultiesEnumValues,
  nonogramCount: z.number(),
});

export const gamesForEachNonogramSchema = z.object({
  id: z.string().uuid(),
  games: z.array(
    z.object({
      timer: z.number(),
      mistakes: z.number(),
      hints: z.number(),
    })
  ),
});

export class gamesCountForEachNonogramDto extends createZodDto(
  gamesCountForEachNonogramSchema
) {}

export class gamesForEachNonogramDto extends createZodDto(
  gamesForEachNonogramSchema
) {}
