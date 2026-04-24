import z from 'zod';

export const GamesForEachNonogramSchema = z
  .object({
    id: z.string().uuid(),
    games: z.array(
      z.object({
        timer: z.number(),
        mistakes: z.number(),
        user: z.object({
          username: z.string(),
        }),
      })
    ),
  })
  .strip();

export type GamesForEachNonogramType = z.infer<
  typeof GamesForEachNonogramSchema
>;
